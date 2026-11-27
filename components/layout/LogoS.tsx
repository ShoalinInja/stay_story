import type { CSSProperties } from "react";

// Centreline of the S in logo-white.png, in the S's own box (x 10, y 15, 67×103 px of the 366×137 logo),
// traced from logo-s-mask.png and drawn from the top hook round to the bottom curl.
const S_PATH =
  "M44.5 30.8L46.3 30.6L47.8 30.1L49.3 29.5L50.8 28.8L52.3 27.9L53.5 26.8L54.8 25.5L55.9 24.3L57.0 23.0L58.0 21.8L58.9 20.3L59.6 18.8L60.1 17.3L60.5 15.8L60.6 14.3L60.6 12.8L60.2 11.3L59.8 9.8L58.9 8.3L57.8 7.0L56.6 6.1L55.3 5.2L53.8 4.6L52.3 4.1L50.8 4.0L49.3 4.0L47.8 4.1L46.3 4.6L44.8 5.1L43.3 5.5L41.8 6.2L40.3 6.8L38.8 7.6L37.3 8.5L36.0 9.4L34.8 10.5L33.5 11.8L32.4 13.0L31.6 14.3L30.8 15.8L29.9 17.3L29.4 18.8L29.1 20.3L28.8 21.8L28.5 23.3L28.2 24.8L28.0 26.3L28.1 27.8L28.3 29.3L28.6 30.8L29.1 32.3L29.6 33.8L30.2 35.3L30.9 36.8L31.8 38.3L32.6 39.8L33.4 41.0L34.4 42.3L35.5 43.5L36.6 44.8L37.5 46.0L38.4 47.3L39.4 48.5L40.4 49.8L41.4 51.0L42.4 52.3L43.4 53.5L44.3 54.8L45.3 56.3L46.1 57.5L46.9 59.0L47.8 60.5L48.4 62.0L49.0 63.5L49.4 65.0L49.7 66.5L49.9 68.0L50.0 69.5L50.0 71.0L50.0 72.5L49.8 74.0L49.6 75.5L49.4 77.0L48.9 78.5L48.6 80.0L48.1 81.5L47.5 83.0L46.9 84.5L46.1 86.0L45.2 87.5L44.3 88.8L43.2 90.0L42.1 91.3L41.0 92.3L39.8 93.3L38.5 94.1L37.0 95.1L35.5 95.8L34.0 96.4L32.5 96.9L31.0 97.3L29.5 97.5L28.0 97.7L26.5 97.8L25.0 97.8L23.5 97.8L22.0 97.7L20.5 97.3L19.0 97.0L17.5 96.7L16.0 96.2L14.5 95.6L13.3 94.8L12.0 93.9L10.8 92.8L9.7 91.5L8.9 90.0L8.3 88.5L7.8 87.0L7.4 85.5L7.1 84.0L6.9 82.5L6.7 81.0L6.7 79.5L6.9 78.0L7.2 76.5L7.7 75.0L8.6 73.5L9.5 72.0L10.6 70.9L11.8 69.8L13.0 68.5L14.3 67.5L15.5 66.6L17.0 65.8L18.5 65.1L20.0 64.4L21.5 63.9L23.0 63.8L24.5 63.9L26.0 64.1L27.5 64.6L27.5 64.6";

// Ribbon layers, widest first: offset bands of gold and black, each starting a beat after the last.
const INK = [
  { color: "#1e1e1e", width: 18, dx: 0, dy: 0 },
  { color: "#b89b62", width: 12, dx: -0.8, dy: -0.6 },
  { color: "#7d5f2c", width: 7, dx: 1, dy: 0.8 },
  { color: "#ecd39b", width: 3.5, dx: -0.4, dy: 0 },
  { color: "#1e1e1e", width: 1.2, dx: 0.6, dy: 0.4 },
] as const;
const INK_STAGGER_S = 0.08;

/** Draws over the logo's S: it writes itself on as a gold-and-black ribbon, then a glint runs along it.
 *  Masked to the S's exact shape; the white base hides the plain gold S underneath. */
export function LogoS() {
  return (
    <span aria-hidden className="logo-s absolute top-[10.95%] left-[2.73%] h-[75.18%] w-[18.31%]">
      <svg viewBox="0 0 67 103" className="size-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect width="67" height="103" fill="#fff" />
        {INK.map((l, i) => (
          <path
            key={l.width}
            d={S_PATH}
            pathLength={1}
            className="logo-s-ink"
            stroke={l.color}
            strokeWidth={l.width}
            transform={`translate(${l.dx} ${l.dy})`}
            style={{ animationDelay: `${i * INK_STAGGER_S}s` } as CSSProperties}
          />
        ))}
        <path d={S_PATH} pathLength={1} className="logo-s-glint" stroke="#fbeecb" strokeWidth={4} />
      </svg>
    </span>
  );
}
