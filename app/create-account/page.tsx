import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl ">Welcome!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput type="text" placeholder="UserName" required errors={[]} />
        <FormInput type="email" placeholder="Email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          required
          errors={[]}
        />
        <FormButton loading={false} text="Create Account" />
      </form>
      <div className="w-full h-px bg-neutral-500">
        <Link
          className="primary-button flex h-10 items-center justify-center gap-3 text-white"
          href="/sms"
        >
          <span>
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          </span>
          <span>Sign up with SMS</span>
        </Link>
      </div>
    </div>
  );
}
