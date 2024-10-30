import db from "@/lib/db";
import { formatToDate } from "@/lib/utils";
import {
  ChatBubbleBottomCenterTextIcon,
  DivideIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

async function getPosts() {
  // await new Promise((resolve) => setTimeout(resolve, 100000));
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      user: {
        select: {
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
    orderBy: {
      created_at: "desc",
    },
  });
  return posts;
}

export const metadata = {
  title: "Life",
};

export default async function Life() {
  const posts = await getPosts();
  console.log(posts);
  return (
    <div className="p-5 flex flex-col">
      {posts.map((post) => (
        <Link
          href={`/life/${post.id}`}
          key={post.id}
          className="pb-5 mb-5 border-b border-neutral-400 flex flex-col last:pb-0 last:border-b-0 gap-2 text-neutral-400"
        >
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-lg font-semibold">{post.title}</h2>
              <p>{post.description}</p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-4 items-center">
                  <span> {formatToDate(post.created_at)}</span>
                  <span>.</span>
                  <div>조회 {post.views}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-between items-center">
              <img
                src={post.user.avatar ?? ""}
                alt="avatar"
                className="size-10 rounded-full"
              />
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <HeartIcon className="size-5" />
                  <span>{post._count.Likes}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <ChatBubbleBottomCenterTextIcon className="size-5" />
                  <span>{post._count.Comments}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
