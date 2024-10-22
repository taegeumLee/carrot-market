"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import fs from "fs/promises";
const productSchema = z.object({
  title: z
    .string({
      required_error: "제목은 필수입니다",
    })
    .min(2)
    .max(40),
  price: z
    .string({
      required_error: "가격은 필수입니다",
    })
    .min(1),
  description: z
    .string({
      required_error: "설명은 필수입니다",
    })
    .max(200),
  photos: z.string({
    required_error: "사진은 필수입니다",
  }),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    photos: formData.get("photo"),
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
      redirect(`/products/${product.id}`);
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
