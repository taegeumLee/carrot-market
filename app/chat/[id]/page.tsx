import ChatMessagesList from "@/components/chatMessegesList";
import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

// 채팅방 정보 캐싱
const getCachedRoom = nextCache(
  async (id: string, userId: number) => {
    const room = await db.chatRoom.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true },
        },
      },
    });

    if (room) {
      const canSee = Boolean(room.users.find((user) => user.id === userId));
      if (!canSee) return null;
    }
    return room;
  },
  ["chat-room"],
  {
    revalidate: 60,
    tags: ["chat-room"],
  }
);

// 메시지 목록 캐싱
const getCachedMessages = nextCache(
  async (chatRoomId: string) => {
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
            id: true,
            avatar: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });
    return messages;
  },
  ["chat-messages"],
  {
    revalidate: 1, // 1초
    tags: ["chat-messages"],
  }
);

// 사용자 프로필 캐싱
const getCachedUserProfile = nextCache(
  async (userId: number) => {
    const profile = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        avatar: true,
        username: true,
      },
    });
    return profile;
  },
  ["user-profile"],
  {
    revalidate: 60, // 1분
    tags: ["user-profile"],
  }
);

export type InitialMessages = Prisma.PromiseReturnType<
  typeof getCachedMessages
>;

export default async function ChatDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session.id) return notFound();

  const room = await getCachedRoom(id, session.id);
  if (!room) return notFound();

  const [messages, user] = await Promise.all([
    getCachedMessages(id),
    getCachedUserProfile(session.id),
  ]);

  if (!user) return notFound();

  return (
    <ChatMessagesList
      initialMessages={messages}
      userId={user.id}
      chatRoomId={id}
      username={user.username!}
      avatar={user.avatar}
    />
  );
}
