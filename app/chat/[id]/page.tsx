import ChatMessagesList from "@/components/chatMessegesList";
import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }

  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}
export type InitialMessages = Prisma.PromiseReturnType<typeof getMessages>;

async function getUserProfile() {
  const user = await getSession();
  const profile = await db.user.findUnique({
    where: {
      id: user.id!,
    },
    select: {
      avatar: true,
      username: true,
    },
  });
  return profile;
}

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    notFound();
  }
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    notFound();
  }
  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      initialMessages={initialMessages}
      username={user.username}
      avatar={user.avatar}
    />
  );
}
