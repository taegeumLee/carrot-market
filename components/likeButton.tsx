"use client";

import { dislikePost, likePost } from "@/app/life/[id]/actions";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prevState, payload) => {
      return {
        isLiked: !prevState.isLiked,
        likeCount: prevState.isLiked
          ? prevState.likeCount - 1
          : prevState.likeCount + 1,
      };
    }
  );
  const onClick = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-row items-center gap-2 border border-neutral-200 rounded-md p-2 transition-colors ${
        state.isLiked ? "bg-orange-500 text-white border-orange-500" : ""
      }`}
    >
      <HeartIcon className="size-5" />
      <span>{state.likeCount} likes</span>
    </button>
  );
}
