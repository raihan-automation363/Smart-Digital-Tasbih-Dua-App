import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([len, combined, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // filter type 0
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function sdRoundedBox(px, py, bx, by, r) {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  const out = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inn = Math.min(Math.max(qx, qy), 0);
  return out + inn - r;
}

function blend(dst, idx, r, g, b, a) {
  const alpha = Math.max(0, Math.min(1, a));
  const inv = 1 - alpha;
  dst[idx] = Math.round(dst[idx] * inv + r * alpha);
  dst[idx + 1] = Math.round(dst[idx + 1] * inv + g * alpha);
  dst[idx + 2] = Math.round(dst[idx + 2] * inv + b * alpha);
  dst[idx + 3] = 255;
}

function renderIcon(size, { maskable = false, rounded = false } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const scale = maskable ? 0.68 : 0.88;
  const aa = 1.6 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Normalized coords [-1, 1]
      const nx = ((x + 0.5) / size) * 2 - 1;
      const ny = ((y + 0.5) / size) * 2 - 1;

      // Emerald gradient background
      const gradT = (nx + ny + 2) / 4;
      const bgR = Math.round(11 * (1 - gradT) + 5 * gradT);
      const bgG = Math.round(98 * (1 - gradT) + 59 * gradT);
      const bgB = Math.round(72 * (1 - gradT) + 44 * gradT);

      let bgAlpha = 1;
      if (rounded) {
        const dRound = sdRoundedBox(nx, ny, 0.98, 0.98, 0.36);
        bgAlpha = 1 - smoothstep(-aa, aa, dRound);
      }

      buf[idx] = bgR;
      buf[idx + 1] = bgG;
      buf[idx + 2] = bgB;
      buf[idx + 3] = Math.round(bgAlpha * 255);

      if (bgAlpha < 0.01) continue;

      const sx = nx / scale;
      const sy = ny / scale;

      // Subtle inner radial glow
      const distCenter = Math.hypot(sx, sy);
      const glow = Math.max(0, 1 - distCenter * 1.15) * 0.16;
      blend(buf, idx, 28, 165, 120, glow * bgAlpha);

      // 8-pointed star (2 rotated rounded squares)
      const boxHalf = 0.52;
      const strokeW = 0.045;
      const dBox1 = Math.abs(sdRoundedBox(sx, sy, boxHalf, boxHalf, 0.06)) - strokeW;
      const cos45 = Math.SQRT1_2;
      const rx = sx * cos45 - sy * cos45;
      const ry = sx * cos45 + sy * cos45;
      const dBox2 = Math.abs(sdRoundedBox(rx, ry, boxHalf, boxHalf, 0.06)) - strokeW;
      const dStar = Math.min(dBox1, dBox2);

      const starAlpha = 1 - smoothstep(-aa * 1.5, aa * 1.5, dStar);
      if (starAlpha > 0) {
        const gt = (sx + sy + 1.4) / 2.8;
        const gr = Math.round(245 * (1 - gt) + 202 * gt);
        const gg = Math.round(218 * (1 - gt) + 156 * gt);
        const gb = Math.round(130 * (1 - gt) + 60 * gt);
        blend(buf, idx, gr, gg, gb, starAlpha * bgAlpha);
      }

      // Inner dark emerald medallion
      const dCircleFill = distCenter - 0.36;
      const fillAlpha = 1 - smoothstep(-aa * 1.5, aa * 1.5, dCircleFill);
      if (fillAlpha > 0) {
        blend(buf, idx, 7, 68, 50, fillAlpha * bgAlpha);
      }

      // Inner gold ring
      const dCircleStroke = Math.abs(distCenter - 0.36) - 0.022;
      const ringAlpha = 1 - smoothstep(-aa * 1.5, aa * 1.5, dCircleStroke);
      if (ringAlpha > 0) {
        blend(buf, idx, 232, 198, 108, ringAlpha * bgAlpha);
      }

      // Crescent inside medallion
      const dOuter = Math.hypot(sx + 0.02, sy) - 0.21;
      const dInner = Math.hypot(sx - 0.065, sy + 0.04) - 0.165;
      const dCrescent = Math.max(dOuter, -dInner);
      const crescentAlpha = 1 - smoothstep(-aa * 1.5, aa * 1.5, dCrescent);
      if (crescentAlpha > 0) {
        blend(buf, idx, 246, 222, 138, crescentAlpha * bgAlpha);
      }

      // Small luminous star/bead beside crescent
      const dDot = Math.hypot(sx - 0.11, sy + 0.075) - 0.036;
      const dotAlpha = 1 - smoothstep(-aa * 1.5, aa * 1.5, dDot);
      if (dotAlpha > 0) {
        blend(buf, idx, 252, 238, 178, dotAlpha * bgAlpha);
      }
    }
  }
  return encodePNG(size, size, buf);
}

const outDir = path.resolve(process.cwd(), 'public');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), renderIcon(192, { rounded: true }));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), renderIcon(512, { rounded: true }));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), renderIcon(512, { maskable: true, rounded: false }));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), renderIcon(180, { rounded: false }));

console.log('Generated PWA PNG icons in public/');
