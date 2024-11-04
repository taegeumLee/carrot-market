"use server";
import getSession from "@/lib/session/session";
import db from "../../../../lib/db";
import { productSchema } from "../../upload/schema";
import { revalidatePath } from "next/cache";
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
  if (!session.id) return;
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

    // 모든 관련 경로 revalidate
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.id}`);
    revalidatePath(`/products/${product.id}/edit`);

    return redirect(`/products/${product.id}`);
  }
}

export async function deleteProduct(productId: number) {
  await db.product.delete({
    where: {
      id: productId,
    },
  });

  // 모든 관련 경로 revalidate
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
}
