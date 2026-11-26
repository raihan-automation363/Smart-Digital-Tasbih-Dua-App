# Noor Tasbih (নূর তাসবীহ · نور تسبيح)

An offline-first Progressive Web App (PWA) Islamic Tasbih counter, verified Dhikr library, and Dua companion supporting **Bangla**, **English**, and **Arabic (RTL)**.

## Key Features

- **Offline-First PWA**: Works without an internet connection after initial load via `vite-plugin-pwa` (Workbox service worker, Web App Manifest, 192x192 / 512x512 / maskable icons, Apple touch icon, and offline fallback).
- **100% On-Device Privacy**: All counts, custom dhikrs, edited duas, history, and preferences are saved strictly in `localStorage`. No backend, no login, no ads, no analytics.
- **Tasbih Counter**: Large tactile counter (`Classic Ring`, `Tactile Pad`, `Minimal Zen`), target presets (`33`, `99`, `100`, `1000`, plus custom presets), Undo, Reset confirmation dialog, Screen Wake Lock support, keyboard shortcuts (`Space` / `Enter`), and **After-Prayer Tasbih Mode** (`33x SubhanAllah -> 33x Alhamdulillah -> 34x Allahu Akbar -> 1x Tahlil`).
- **Dhikr & Dua Libraries**: Verified Qur'an and Hadith sources clearly labeled (and unverified/optional counts explicitly marked), full Bangla/English/Arabic support, favourites, search, and full create/edit/delete customization.
- **Personalization**: Light & Dark mode, 5 color presets (`Emerald`, `Midnight`, `Sand`, `Rose`, `Ocean`), custom background color picker, adjustable font sizes, Web Audio API tap/completion sounds, and feature-detected vibration.
- **Statistics & Backup**: Daily goal progress, 7-day activity chart, top dhikr breakdown, session log, and JSON export/import backup.

---

## Local Development

```bash
npm install
npm run dev
```

To build locally with a custom base path:

```bash
VITE_BASE_PATH=/noor-tasbih/ npm run build
npm run preview
```

---

## GitHub Synchronization & GitHub Pages Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Noor Tasbih PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/noor-tasbih.git
git push -u origin main
```

### 2. Enable GitHub Pages (Automated Workflow Included)

1. Open your repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` workflow will automatically build the app with `VITE_BASE_PATH=/<your-repo-name>/` and deploy `./dist` to GitHub Pages whenever you push to `main`.
4. Your live HTTPS PWA will be available at:
   `https://<your-username>.github.io/<your-repo-name>/`

*(If using a custom domain at root `/`, update `VITE_BASE_PATH: /` in `.github/workflows/deploy.yml`.)*

---

## Installing on Your Phone

### Android (Google Chrome)
1. Open the deployed HTTPS link in **Google Chrome**.
2. Tap the **Install Noor Tasbih** button in the top bar or inside **Settings → Install & Offline App** (or open Chrome's `⋮` menu).
3. Tap **Install app** / **Add to Home screen** and confirm.
4. Once installed, open Noor Tasbih from your home screen — it runs in standalone mode and works offline.

### iPhone / iPad (Apple Safari)
1. Open the deployed HTTPS link in **Safari**.
2. Tap the **Share** button (square with upward arrow).
3. Scroll down and tap **Add to Home Screen**, then tap **Add**.
4. Launch Noor Tasbih from your home screen for standalone offline use.
