"use server";

import { SMS_TOKEN_MAX_LENGTH, SMS_TOKEN_MIN_LENGTH } from "@/lib/constants";
import validator from "validator";
import { z } from "zod";

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

const tokenSchema = z.coerce
  .number()
  .min(SMS_TOKEN_MIN_LENGTH)
  .max(SMS_TOKEN_MAX_LENGTH);

export async function smsLogin(prevState: any, formData: FormData) {}
