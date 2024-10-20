"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number, pageSize: number = 10) {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photos: true,
      created_at: true,
    },
    skip: page * pageSize,
    take: pageSize,
    orderBy: {
      created_at: "desc",
    },
  });

  const totalCount = await db.product.count();
  const hasMore = (page + 1) * pageSize < totalCount;

  return { products, hasMore };
}
