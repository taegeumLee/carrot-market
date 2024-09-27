"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  const onClick = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ username: "taegeum", password: "1234" }),
    });
    console.log(await response.json());
  };
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl ">Login</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput type="email" placeholder="Email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <span onClick={onClick}>submit</span>
      </form>
      <FormButton loading={false} text="Log In" />
      <SocialLogin />
    </div>
  );
}
