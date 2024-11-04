"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import fs from "fs/promises";
import { productSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function uploadProduct(formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    photos: formData.get("photos"), // photo -> photos로 수정
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten() };
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          price: Number(result.data.price),
          description: result.data.description,
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
      console.log(product);
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${product.id}`);
      return redirect(`/products/${product.id}`);
    }
  }
}

export async function getUploadURL() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
