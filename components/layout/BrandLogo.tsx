import Image from "next/image";

// The logo, split into transparent 366×137 layers cut from the original PNG so each part can animate.
// The tagline is live text from site.tagline, drawn where the old baked-in tagline sat (x 58–355).
const W = 366;
const H = 137;
const DIR = "/media/brand";
const TAG = { x: 206.5, y: 134, width: 297, size: 16.5, color: "#b89760" };

type LayerProps = { name: string; className: string; alt?: string; preload?: boolean };

function Layer({ name, className, alt = "", preload = false }: LayerProps) {
  return (
    <Image
      src={`${DIR}/logo-${name}.png`}
      alt={alt}
      width={W}
      height={H}
      sizes="128px"
      preload={preload}
      loading={preload ? undefined : "eager"}
      className={`absolute inset-0 size-full ${className}`}
    />
  );
}

/** Header logo, "gold ink signature" (animation in app/globals.css, brand-*). */
export function BrandLogo({ name, tagline }: { name: string; tagline: string }) {
  return (
    <span className="relative block aspect-[366/137] h-11 md:h-12">
      <Layer name="pin" className="brand-pin" />
      <Layer name="word" className="brand-word" alt={name} preload />
      <Layer name="word" className="brand-band" />
      <Layer name="house" className="brand-house" />
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="brand-tag absolute inset-0 size-full">
        <text
          x={TAG.x}
          y={TAG.y}
          textAnchor="middle"
          textLength={TAG.width}
          lengthAdjust="spacing"
          fill={TAG.color}
          fontSize={TAG.size}
          fontWeight={500}
          style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
        >
          {tagline.toUpperCase()}
        </text>
      </svg>
      <Layer name="mark" className="brand-sheen" />
    </span>
  );
}
