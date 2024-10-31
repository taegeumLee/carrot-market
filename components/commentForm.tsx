import db from "@/lib/db";
import Input from "./input";
import getSession from "@/lib/session/session";
import { revalidateTag } from "next/cache";
import { commentSchema } from "@/app/life/[id]/schema";

async function createComment(formData: FormData) {
  "use server";
  const data = {
    payload: formData.get("comment"),
    postId: formData.get("postId"),
  };
  const result = commentSchema.safeParse(data);
  console.log(result);
  if (!result.success) return { error: result.error.flatten() };
  const session = await getSession();
  await db.comment.create({
    data: {
      payload: result.data.payload,
      post: {
        connect: {
          id: Number(result.data.postId),
        },
      },
      user: {
        connect: {
          id: session.id!,
        },
      },
    },
  });
  revalidateTag("comments");
  return { success: true };
}
export default function CommentForm({ postId }: { postId: number }) {
  return (
    <form action={createComment}>
      <Input name="comment" placeholder="댓글을 입력하세요" />
      <input type="hidden" name="postId" value={postId} />
    </form>
  );
}
