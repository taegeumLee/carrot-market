import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { IoLogoGithub } from "react-icons/io";
import Link from "next/link";
export default function SocialLogin() {
  return (
    <>
      <div className="w-full h-px bg-neutral-500 " />
      <Link
        className="primary-button flex h-10 items-center justify-center gap-3 text-white"
        href="/sms"
      >
        <span>
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
        </span>
        <span>Continue with SMS</span>
      </Link>
      <Link
        className="primary-button flex h-10 items-center justify-center gap-3 text-white"
        href="/github/start"
      >
        <span>
          <IoLogoGithub className="size-5" />
        </span>
        <span>Continue with Github</span>
      </Link>
    </>
  );
}
