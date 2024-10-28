"use client";

import { InitialProduct } from "@/app/(tabs)/home/page";
import ListProduct from "./listProduct";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";
interface ProductListProps {
  initialProducts: InitialProduct;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentObserverTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          const { products: newProducts, hasMore: moreProducts } =
            await getMoreProducts(page + 1);
          if (newProducts.length > 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          }
          setHasMore(moreProducts);
          setIsLoading(false);
        }
      },
      { threshold: 1.0 }
    );

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [page, hasMore, isLoading]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <div ref={observerTarget} className="h-10">
        {isLoading && <p className="text-center">Loading...</p>}
      </div>
    </div>
  );
}
