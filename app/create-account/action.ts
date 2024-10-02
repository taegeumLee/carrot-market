"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

function validateUsername(username: string) {
  return username.includes("yami");
}
const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const userEmail = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(userEmail);
};

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
      .trim()
      .toLowerCase()
      .refine(
        (username) => validateUsername(username),
        "username must be unique"
      )
      .refine(checkUniqueUsername, "This username is already taken"),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, "There is already an account with this email"),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
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
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    //hash the password
    //save the user to the database
    //log the user in
    //redirect to the '/'
  }
}
