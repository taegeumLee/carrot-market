"use client";

import { InitialProduct } from "@/app/(tabs)/products/page";
import ListProduct from "./listProduct";
import { useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";
interface ProductListProps {
  initialProducts: InitialProduct;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadMoreClick = async () => {
    console.log("clicked");
    setIsLoading(true);
    try {
      const moreProducts = await getMoreProducts(1);
      setProducts((prev) => [...prev, ...moreProducts]);
    } catch (error) {
      console.error("제품을 더 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <button
        disabled={isLoading}
        onClick={onLoadMoreClick}
        className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
      >
        {isLoading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}
