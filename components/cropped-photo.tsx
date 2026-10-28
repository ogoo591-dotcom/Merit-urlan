import Image from "next/image";

type CroppedPhotoProps = {
  alt: string;
  // Point of /Hero.jpg to zoom into, as a CSS position ("48% 40%").
  focus: string;
  zoom?: number;
  sizes: string;
  className?: string;
};

// Only one real product photo exists yet, so sections zoom into different
// toys of it. Swap `src` for dedicated photos once they are available.
export function CroppedPhoto({ alt, focus, zoom = 1, sizes, className = "" }: CroppedPhotoProps) {
  return (
    <div className={`relative overflow-hidden bg-[#f3ebe2] ${className}`}>
      <Image
        src="/Hero.jpg"
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: focus, transform: `scale(${zoom})`, transformOrigin: focus }}
      />
    </div>
  );
}
