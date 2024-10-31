import Comments from "@/components/Comments";
import LikeButton from "@/components/likeButton";
import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { formatToDate } from "@/lib/utils";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/solid";
import { revalidateTag, unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import CommentForm from "@/components/commentForm";

export const metadata = {
  title: "Life",
};
async function getIsLikedStatus(postId: number, userId: number) {
  const isLike = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLike),
  };
}
async function getCachedIsLikedStatus(postId: number) {
  const session = await getSession();
  const cacheOperation = unstable_cache(getIsLikedStatus, ["is-liked-status"], {
    tags: [`is-liked-status-${postId}`],
  });
  return cacheOperation(postId, session.id!);
}
async function getPost(id: string) {
  try {
    const post = await db.post.update({
      where: { id: Number(id) },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            Comments: true,
          },
        },
      },
    });
    if (!post) {
      notFound();
    }
    return post;
  } catch (error) {
    notFound();
  }
}
const getCachedPost = unstable_cache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

export default async function LifeDetail({
  params,
}: {
  params: { id: string };
}) {
  const post = await getCachedPost(params.id);

  const { likeCount, isLiked } = await getCachedIsLikedStatus(
    Number(params.id)
  );
  return (
    <div className="flex flex-col m-2 p-2">
      <div className="flex gap-5 items-center mb-5">
        <img
          src={post.user.avatar ?? ""}
          alt="avatar"
          className="size-10 rounded-full"
        />
        <div className="flex flex-col">
          <span>{post.user.username}</span>
          <span>{formatToDate(post.created_at)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-semibold mb-1">{post.title}</span>
        <span className="text-lg">{post.description}</span>
        <div className="flex flex-row items-center gap-2">
          <EyeIcon className="size-5" />
          <span>{post.views} views</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={post.id} />
      </div>

      <div className=" w-full mt-4 bg-neutral-800 p-2 rounded-md">
        <Comments postId={post.id} />
      </div>
      <div className="fixed bottom-0 w-full left-0 p-5  bg-neutral-700">
        <CommentForm postId={post.id} />
      </div>
    </div>
  );
}
