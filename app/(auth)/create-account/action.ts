"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getIronUserSession from "@/lib/session/session";
import UpdateSession from "@/lib/session/updateSession";

const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  return password === confirmPassword;
};
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "username must be a string",
      })
      .trim()
      .toLowerCase(),
    // .refine(
    //   (username) => validateUsername(username),
    //   "username must be unique"
    // ),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string(),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "There is already an account with this email",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(
    ({ password, confirmPassword }) =>
      checkPassword({ password, confirmPassword }),
    {
      message: "passwords do not match",
      path: ["confirmPassword"],
    }
  );

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    //hash the password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    //save the user to the database
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    //log the user in
    await UpdateSession(user.id);
    //redirect to the '/'
    redirect("/profile");
  }
}
