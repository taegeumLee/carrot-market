"use client";
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useFormState, useFormStatus } from "react-dom";
import { handleForm } from "./actions";

export default function Login() {
  const [state, action] = useFormState(handleForm, null);
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl ">Welcome!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <FormButton text="Log In" />
      </form>
      <SocialLogin />
    </div>
  );
}
