import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { formatToDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

async function getLastMessage(roomId: string) {
  try {
    const lastMessage = await db.message.findFirst({
      where: {
        chatRoomId: roomId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return lastMessage;
  } catch (error) {
    console.error("Error fetching last message:", error);
    return null;
  }
}

async function getChatRooms() {
  try {
    const session = await getSession();
    if (!session.id) throw new Error("Session not found");

    const chatRooms = await db.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
        users: {
          select: {
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
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return [];
  }
}

export default async function Chat() {
  const chatRooms = await getChatRooms();
  const lastMessages = await Promise.all(
    chatRooms.map((room) => getLastMessage(room.id))
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
