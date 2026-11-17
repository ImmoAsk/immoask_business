"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { focusRing } from "@/components/ui/styles";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be rendered inside Tabs.");
  }
  return context;
}

export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
};

export function Tabs({ value, defaultValue = "", onValueChange, children, className }: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selected = value ?? uncontrolled;
  const baseId = useId();

  function setValue(next: string) {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  }

  return (
    <TabsContext.Provider value={{ value: selected, setValue, baseId }}>
      <div className={cn("flex flex-col gap-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const current = tabs.findIndex((tab) => tab === document.activeElement);
    if (current === -1 || tabs.length === 0) return;

    event.preventDefault();
    const nextIndex =
      event.key === "ArrowRight"
        ? (current + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (current - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : tabs.length - 1;

    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  }

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex h-10 w-fit items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900",
        className,
      )}
      {...props}
    />
  );
}

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({ className, value, onClick, ...props }: TabsTriggerProps) {
  const tabs = useTabsContext();
  const selected = tabs.value === value;

  return (
    <button
      {...props}
      type="button"
      role="tab"
      id={tabDomId(tabs.baseId, value, "tab")}
      aria-controls={tabDomId(tabs.baseId, value, "panel")}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      data-state={selected ? "active" : "inactive"}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center justify-center rounded-full px-3 text-sm font-medium whitespace-nowrap text-zinc-600 transition-colors dark:text-zinc-400",
        focusRing,
        selected && "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) tabs.setValue(value);
      }}
    />
  );
}

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabsContent({ className, value, ...props }: TabsContentProps) {
  const tabs = useTabsContext();
  const selected = tabs.value === value;

  return (
    <div
      {...props}
      role="tabpanel"
      id={tabDomId(tabs.baseId, value, "panel")}
      aria-labelledby={tabDomId(tabs.baseId, value, "tab")}
      hidden={!selected}
      tabIndex={0}
      data-state={selected ? "active" : "inactive"}
      className={cn("outline-none", className)}
    />
  );
}

function tabDomId(baseId: string, value: string, part: "tab" | "panel") {
  return `${baseId}-${part}-${encodeURIComponent(value)}`;
}
