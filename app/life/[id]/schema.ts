import { z } from "zod";
export const commentSchema = z.object({
  payload: z
    .string({
      required_error: "payload is required.",
    })
    .min(5),
  postId: z.string({
    required_error: "title is required.",
  }),
});
