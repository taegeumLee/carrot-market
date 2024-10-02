"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { smsLogin } from "./action";
import { SMS_TOKEN_MAX_LENGTH, SMS_TOKEN_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
  const [state, dispatch] = useFormState(smsLogin, null);
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl ">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input name="phone" type="text" placeholder="Phone number" required />
        <Input
          name="token"
          type="number"
          placeholder="Verification code"
          minLength={SMS_TOKEN_MIN_LENGTH}
          maxLength={SMS_TOKEN_MAX_LENGTH}
          required
        />

        <Button text="Verify" />
      </form>
    </div>
  );
}
