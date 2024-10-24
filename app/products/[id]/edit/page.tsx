import React from "react";
import EditForm from "@/components/edit_form";
import { notFound } from "next/navigation";
import getSession from "@/lib/session/session";
import db from "@/lib/db";

async function getProduct(id: number) {
  try {
    const product = await db.product.findUnique({
      where: { id },
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
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

const EditProduct = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const product = await getProduct(id);
  if (!product) return notFound();
  const session = await getSession();
  const isOwner = session.id === product.userId;
  return (
    <div>
      <EditForm
        id={id}
        product={{
          ...product,
          price: product.price.toString(), // price를 문자열로 환
        }}
        isOwner={isOwner}
      />
    </div>
  );
};

export default EditProduct;
