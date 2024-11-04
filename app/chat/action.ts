"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { revalidatePath } from "next/cache";

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  const message = await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
  });

  // 채팅방 목록과 채팅방 페이지 revalidate
  revalidatePath("/chat");
  revalidatePath(`/chat/${chatRoomId}`);

  return message;
}
