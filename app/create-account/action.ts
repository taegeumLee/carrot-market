"use server";
import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);

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
      .trim()
      .toLowerCase().transform(username => )
      .refine(
        (username) => validateUsername(username),
        "username must be unique"
      ),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(10)
      .regex(
        passwordRegex,
        "A password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
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
  } else {
    console.log(result.data);
  }
}
