"use server";
import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { revalidateTag } from "next/cache";
import { commentSchema } from "./schema";
import Input from "@/components/input";
export async function likePost(postId: number) {
  try {
    const session = await getSession();
    await db.like.create({
      data: {
        postId: Number(postId),
        userId: session.id!,
      },
    });
    revalidateTag(`is-liked-status-${postId}`);
  } catch (e) {}
}
export async function dislikePost(postId: number) {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId: Number(postId),
          userId: session.id!,
        },
      },
    });
    revalidateTag(`is-liked-status-${postId}`);
  } catch (e) {
    console.log(e);
  }
}
