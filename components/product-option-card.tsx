import Image from "next/image";
import Link from "next/link";

type ProductOptionCardProps = {
  href: string;
  image: string;
  name: string;
  price: string;
  stock: number;
  selected?: boolean;
};

export function ProductOptionCard({
  href,
  image,
  name,
  price,
  stock,
  selected = false,
}: ProductOptionCardProps) {
  return (
    <Link
      href={href}
      className={`relative block min-w-[12rem] shrink-0 rounded-[1.4rem] border bg-white p-3 transition ${
        selected
          ? "border-[#f59b17] shadow-[0_0_0_2px_rgba(245,155,23,0.15)]"
          : "border-[#dfe3e6] hover:border-[#ffbe5d]"
      }`}
    >
      {selected ? (
        <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#1fc28b] text-xl font-bold text-white">
          ✓
        </div>
      ) : null}
      <Image
        src={image}
        alt=""
        width={400}
        height={280}
        className="h-24 w-full rounded-xl bg-[#f7f7f7] object-contain p-2"
      />
      <div className="mt-3 text-center">
        <p className="truncate text-sm text-[#7f8b97]">{name}</p>
        <p className="mt-2 text-xl font-semibold text-[#ff5a36]">{price}</p>
        <p className="mt-1 text-lg text-[#28a745]">{stock} ш</p>
      </div>
    </Link>
  );
}
