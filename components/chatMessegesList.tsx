"use client";

import { InitialMessages } from "@/app/chat/[id]/page";
import { formatToDate } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { saveMessage } from "@/app/chat/action";

const SUPABASE_URL = "https://dsnfkunkxwrddtqdfbay.supabase.co";
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbmZrdW5reHdyZGR0cWRmYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2MzY2MjEsImV4cCI6MjA0NjIxMjYyMX0.3WdUXFrBFFfYR-spkcDY9ECuu8QE6zgVlhxleP_sRl8";
interface ChatMessagesListProps {
  initialMessages: InitialMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string | null;
}

interface Message {
  id: number;
  payload: string;
  created_at: Date;
  userId: number;
  user: {
    avatar: string | null;
    username: string;
  };
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();

  const sendMessage = async (message: string) => {
    if (isSubmitting || !message.trim()) return;

    setIsSubmitting(true);

    // Optimistic update
    const optimisticMessage = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      user: {
        avatar,
        username,
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("chatRoomId", chatRoomId);

      await saveMessage(message, chatRoomId);
    } catch (error) {
      // 실패시 optimistic update 롤백
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      console.error("Failed to send message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY!);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.payload]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage(message);
    setMessage("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              className={`rounded-full size-10 `}
              src={message.user.avatar ?? ""}
              alt={message.user.username}
              width={50}
              height={50}
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-gray-500" : "bg-orange-500"
              } p-2.5 rounded-md `}
            >
              {message.payload}
            </span>
            <span className="text-sm">{formatToDate(message.created_at)}</span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          placeholder="메시지를 입력하세요"
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-50 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
        />
      </form>
    </div>
  );
}
