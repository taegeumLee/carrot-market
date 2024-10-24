"use server";
import getSession from "@/lib/session/session";
import db from "@/lib/db";
import { productSchema } from "../../upload/schema";
import { redirect } from "next/navigation";

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      photos: true,
      title: true,
      price: true,
      description: true,
      userId: true,
    },
  });
  return product;
}

export async function deletePhoto(photoId: string) {
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function editProduct(formData: FormData) {
  const session = await getSession();
  if (!session.id) throw new Error("User not authenticated");

  const data = {
    id: formData.get("id"),
    photos: formData.get("photos"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try {
      const product = await db.product.update({
        where: {
          id: Number(data.id),
        },
        data: {
          title: result.data.title,
          description: result.data.description,
          price: Number(result.data.price),
          photos: result.data.photos,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/home/${product.id}`);
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }
}
