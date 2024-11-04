import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { formatToDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";

// 채팅방 목록 캐싱
const getCachedChatRooms = nextCache(
  async (userId: number) => {
    const chatRooms = await db.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        product: {
          select: {
            photos: true,
          },
        },
      },
    });
    return chatRooms;
  },
  ["chat-rooms"],
  {
    revalidate: 10, // 10초
    tags: ["chat-rooms"],
  }
);

// 마지막 메시지 캐싱
const getCachedLastMessages = nextCache(
  async (chatRoomIds: string[]) => {
    const lastMessages = await Promise.all(
      chatRoomIds.map((roomId) =>
        db.message.findFirst({
          where: {
            chatRoomId: roomId,
          },
          orderBy: {
            created_at: "desc",
          },
          select: {
            payload: true,
            created_at: true,
          },
        })
      )
    );
    return lastMessages;
  },
  ["last-messages"],
  {
    revalidate: 1, // 1초
    tags: ["last-messages"],
  }
);

export default async function ChatList() {
  const session = await getSession();
  if (!session.id) return null;

  const chatRooms = await getCachedChatRooms(session.id);
  const lastMessages = await getCachedLastMessages(
    chatRooms.map((room) => room.id)
  );

  return (
    <div className="flex flex-col m-5 ">
      {chatRooms.map((room, index) => {
        const user = room.users[1];
        const lastMessage = lastMessages[index];

        return (
          <Link key={room.id} href={`/chat/${room.id}`}>
            <div className="flex w-full h-20 gap-2  items-center mb-4 rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer">
              <div className="flex relative p-0 mr-6">
                {user.avatar ? (
                  <Image
                    className="rounded-full relative bottom-3  border-2 border-black border-solid"
                    width={50}
                    height={50}
                    src={user.avatar}
                    alt="avatar"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 relative bottom-3  border-2 border-black border-solid" />
                )}{" "}
                <Image
                  className="rounded-md absolute top-1 left-3 border-2 border-black border-solid"
                  width={50}
                  height={50}
                  src={`${room.product!.photos}/avatar`}
                  alt="product"
                />
              </div>
              <div className="flex flex-col ">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{user?.username}</span>
                  <span className="text-sm text-gray-500">
                    {formatToDate(lastMessage?.created_at ?? new Date())}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {lastMessage?.payload}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
