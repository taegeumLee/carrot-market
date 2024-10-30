import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { formatToDate } from "@/lib/utils";
import {
  EyeIcon,
  HeartIcon,
  TrophyIcon,
  ViewColumnsIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/solid";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Life",
};
async function getIsLiked(postId: number) {
  const session = await getSession();
  const like = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  return Boolean(like);
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
            Likes: true,
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

export default async function LifeDetail({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);
  const likePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.create({
        data: {
          postId: Number(params.id),
          userId: session.id!,
        },
      });
      revalidatePath(`/life/${params.id}`);
    } catch (e) {}
  };
  const dislikePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.delete({
        where: {
          id: {
            postId: Number(params.id),
            userId: session.id!,
          },
        },
      });
      revalidatePath(`/life/${params.id}`);
    } catch (e) {
      console.log(e);
    }
  };
  const isLiked = await getIsLiked(Number(params.id));
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
        <form
          action={isLiked ? dislikePost : likePost}
          className="flex flex-row items-center w-fit border border-neutral-200 rounded-md p-2 "
        >
          <button className="flex flex-row items-center gap-2">
            <HeartIcon className="size-5" />
            <span>{post._count.Likes} likes</span>
          </button>
        </form>
      </div>
    </div>
  );
}
