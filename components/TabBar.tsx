"use client";

import {
  NewspaperIcon,
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  VideoCameraIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineLiveIcon,
  UserIcon as OutlineProfileIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType } from "react";
import type { SVGProps } from "react";

interface TabItem {
  href: string;
  label: string;
  SolidIcon: ComponentType<SVGProps<SVGSVGElement>>;
  OutlineIcon: ComponentType<SVGProps<SVGSVGElement>>;
}

const tabItems: TabItem[] = [
  {
    href: "/products",
    label: "products",
    SolidIcon: HomeIcon,
    OutlineIcon: OutlineHomeIcon,
  },
  {
    href: "/chat",
    label: "Chat",
    SolidIcon: ChatBubbleOvalLeftIcon,
    OutlineIcon: OutlineChatIcon,
  },
  {
    href: "/life",
    label: "Life",
    SolidIcon: NewspaperIcon,
    OutlineIcon: OutlineNewspaperIcon,
  },
  {
    href: "/live",
    label: "Live",
    SolidIcon: VideoCameraIcon,
    OutlineIcon: OutlineLiveIcon,
  },
  {
    href: "/profile",
    label: "Profile",
    SolidIcon: UserIcon,
    OutlineIcon: OutlineProfileIcon,
  },
];

export default function TabBar() {
  const pathname = usePathname();

  const renderTabItem = ({ href, label, SolidIcon, OutlineIcon }: TabItem) => {
    const isActive = pathname === href;
    const Icon = isActive ? SolidIcon : OutlineIcon;

    return (
      <Link
        key={href}
        href={href}
        className="flex flex-col items-center gap-px"
      >
        <Icon className="w-7 h-7" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white">
      {tabItems.map(renderTabItem)}
    </div>
  );
}
