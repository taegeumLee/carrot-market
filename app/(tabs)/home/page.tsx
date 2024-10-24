import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

const getCacheProducts = nextCache(getInitialProducts, ["home-products"], {
  revalidate: 60,
});

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photos: true,
      id: true,
    },
    take: 10, // 초기 로드 시 더 많은 제품을 가져옵니다
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProduct = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCacheProducts();
  return (
    <div className="relative min-h-screen">
      <h1 className="text-2xl font-bold text-center py-4">제품 목록</h1>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/upload"
        className="bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white "
        aria-label="새 제품 추가"
      >
        <PlusIcon className="size-8" />
      </Link>
    </div>
  );
}
