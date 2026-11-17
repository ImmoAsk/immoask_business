"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { focusRing } from "@/components/ui/styles";

const widths = {
  sm: "w-[min(24rem,calc(100%-2rem))]",
  md: "w-[min(32rem,calc(100%-2rem))]",
  lg: "w-[min(42rem,calc(100%-2rem))]",
} as const;

type DialogContextValue = {
  titleId: string;
  descriptionId: string;
  close: () => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be rendered inside Dialog.");
  }
  return context;
}

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  hideClose?: boolean;
  size?: keyof typeof widths;
};

export function Dialog({ open, ...props }: DialogProps) {
  if (!open) return null;
  return <DialogOpen {...props} />;
}

function DialogOpen({
  onOpenChange,
  children,
  className,
  hideClose = false,
  size = "md",
}: Omit<DialogProps, "open">) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    closingRef.current = false;
    if (!dialog.open) dialog.showModal();

    return () => {
      closingRef.current = true;
      if (dialog.open) dialog.close();
    };
  }, []);

  function close() {
    onOpenChange(false);
  }

  return (
    <DialogContext.Provider value={{ titleId, descriptionId, close }}>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => {
          if (closingRef.current) return;
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className={cn(
          "m-auto max-h-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-black/10 bg-white p-0 text-zinc-950 shadow-xl backdrop:bg-zinc-950/40 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-50 dark:backdrop:bg-black/70",
          widths[size],
          className,
        )}
      >
        <div className="relative p-6">
          {hideClose ? null : (
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className={cn(
                "absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 hover:bg-black/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50",
                focusRing,
              )}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5 15 15M15 5 5 15" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {children}
        </div>
      </dialog>
    </DialogContext.Provider>
  );
}

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialogContext();
  return <h2 id={titleId} className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialogContext();

  return (
    <p
      id={descriptionId}
      className={cn("text-sm text-zinc-600 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex items-center justify-end gap-3", className)} {...props} />;
}

export function DialogClose({
  className,
  onClick,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { close } = useDialogContext();

  return (
    <button
      {...props}
      type={type}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) close();
      }}
    />
  );
}
