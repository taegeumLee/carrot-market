import { formatToDate, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photos: string;
  id: number;
}

export default function ListProduct({
  title,
  price,
  created_at,
  photos,
  id,
}: ListProductProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex gap-5 p-3 bg-neutral-800 rounded-lg"
    >
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image fill src={photos} alt={title} className="object-cover" />
      </div>

      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg font-bold">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToDate(created_at)}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}</span>
      </div>
    </Link>
  );
}
