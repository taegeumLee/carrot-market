import db from "@/lib/db";
import { formatToDate } from "@/lib/utils";
import { revalidateTag, unstable_cache } from "next/cache";

async function getPost(postId: number) {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      user: true,
      Comments: {
        include: {
          user: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
  return post;
}

const getCachedPost = unstable_cache(getPost, ["comments"], {
  tags: ["comments"],
  revalidate: 60,
});

export default async function Comments({ postId }: { postId: number }) {
  const post = await getCachedPost(postId);
  if (!post) return null;
  return (
    <div className="flex flex-col gap-2 ">
      {post.Comments.map((comment) => (
        <div key={comment.id} className="flex flex-col mb-3">
          <div className="flex flex-row gap-2 p-2 rounded-md">
            <img
              src={comment.user.avatar ?? ""}
              alt="avatar"
              className="size-8 rounded-full"
            />
            <div className="flex flex-col">
              <span>{comment.user.username}</span>
              <span className="text-xs text-gray-400">
                {formatToDate(comment.created_at)}
              </span>
            </div>
          </div>
          <span className="ml-10">{comment.payload}</span>
        </div>
      ))}
    </div>
  );
}
