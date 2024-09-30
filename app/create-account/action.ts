"use server";
import { z } from "zod";

function validateUsername(username: string) {
  return username.includes("yami");
}

const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  password === confirmPassword;
};
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "username must be a string",
      })
      .min(4, "way too short")
      .max(15, "way too long")
      .refine(
        (username) => validateUsername(username),
        "username must be unique"
      ),
    email: z.string().email(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
  })
  .refine(({ password, confirmPassword }) => checkPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }
}
