import React from 'react';

interface IslamicPatternBgProps {
  accentHex: string;
}

export const IslamicPatternBg: React.FC<IslamicPatternBgProps> = ({ accentHex }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.045] dark:opacity-[0.06]"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="noor-geometric-lattice"
            width="88"
            height="88"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke={accentHex} strokeWidth="1">
              <rect x="20" y="20" width="48" height="48" rx="4" />
              <rect
                x="20"
                y="20"
                width="48"
                height="48"
                rx="4"
                transform="rotate(45 44 44)"
              />
              <circle cx="44" cy="44" r="10" />
              <path d="M0 44 L10 44 M78 44 L88 44 M44 0 L44 10 M44 78 L44 88" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#noor-geometric-lattice)" />
      </svg>
    </div>
  );
};
