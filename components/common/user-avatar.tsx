"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  image?: string | null;
  className?: string;
  imageClassName?: string;
};

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "?";
}

export function UserAvatar({
  name,
  image,
  className,
  imageClassName,
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(image) && !imageFailed;

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#e4f2ee] text-xs font-bold text-[#176b5a]",
        className
      )}
    >
      {shouldShowImage ? (
        <Image
          src={image!}
          alt=""
          width={96}
          height={96}
          className={cn("size-full object-cover", imageClassName)}
          onError={() => setImageFailed(true)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
