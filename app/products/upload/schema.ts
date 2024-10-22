import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(2)
    .max(40),
  price: z
    .string({
      required_error: "Price is required",
    })
    .min(1),
  description: z
    .string({
      required_error: "Description is required",
    })
    .max(200),
  photos: z.string({
    required_error: "Photo is required",
  }),
});
export type ProductType = z.infer<typeof productSchema>;
