import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "./button";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatToWon } from "@/lib/utils";

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function Modal({ params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const id = Number(params.id);
  isNaN(id) && notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-70 left-0 top-0 ">
      <Button className="absolute right-5 top-5 text-white hover:text-gray-300 transition-colors">
        <XMarkIcon className="size-8" />
      </Button>
      <div className="w-full max-w-md bg-neutral-800 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          <div className="relative aspect-square">
            <Image
              fill
              src={`${product.photos}/public`}
              alt={product.title}
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-4 border-b border-neutral-700 p-4">
            <div className="size-12 overflow-hidden rounded-full bg-neutral-700">
              {product.user.avatar !== null ? (
                <Image
                  src={product.user.avatar}
                  width={48}
                  height={48}
                  alt={product.user.username}
                  className="object-cover"
                />
              ) : (
                <UserIcon className="size-full text-neutral-400 p-2" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-lg text-white">
                {product.user.username}
              </h3>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h1 className="text-2xl font-bold text-white">{product.title}</h1>
            <p className="text-gray-300">{product.description}</p>
          </div>
          <div className="p-4 flex justify-end items-center">
            <h2 className="text-lg font-semibold text-orange-500">
              {formatToWon(product.price)}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
