"use client";

import { useState, type HTMLAttributes, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
} as const;

export type AvatarSize = keyof typeof sizes;

export function Avatar({
  className,
  size = "md",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { size?: AvatarSize }) {
  return (
    <span
      {...props}
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-zinc-100 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
        sizes[size],
        className,
      )}
    />
  );
}

export function AvatarImage({
  className,
  alt = "",
  src,
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const srcKey = typeof src === "string" ? src : "";
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = srcKey !== "" && failedSrc === srcKey;

  if (!src || failed) return null;

  return (
    // User and tenant photos come from arbitrary URLs, so this is a plain image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={src}
      alt={alt}
      className={cn("absolute inset-0 size-full object-cover", className)}
      onError={(event) => {
        if (srcKey) setFailedSrc(srcKey);
        onError?.(event);
      }}
    />
  );
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn("flex size-full items-center justify-center", className)}
    />
  );
}
