import db from "@/lib/db";
import { formatToDate, formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { unstable_cache as nextCache } from "next/cache";
import getSession from "@/lib/session/session";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(Number(params.id));
  return {
    title: product?.title,
    description: product?.description,
  };
}

async function getIsOwner(userId: number) {
  const session = await getSession();

  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id: id,
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

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  const onDelete = async () => {
    "use server";
    await db.product.delete({
      where: {
        id: id,
      },
    });
    redirect("/home");
  };

  return (
    <div>
      <div className="relative size-auto aspect-square ">
        <Image
          fill
          src={product.photos + "/public"}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <UserIcon className="size-10" />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold pb-2">{product.title}</h1>
        <p className="text-xs text-neutral-300 pb-5">
          업데이트 {formatToDate(product.created_at)}
        </p>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">
          {formatToWon(product.price)}
        </span>
        <div className="flex items-center">
          {isOwner ? (
            <Link
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
              href={`/products/${id}/edit`}
            >
              Edit
            </Link>
          ) : (
            <Link
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
              href={""}
            >
              Chat
            </Link>
          )}

          {isOwner ? (
            <form action={onDelete}>
              <button className="bg-red-500 px-5 py-2.5 mx-2 rounded-md text-white font-semibold">
                Delete Product
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
}
