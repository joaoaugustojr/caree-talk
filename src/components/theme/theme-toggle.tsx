"use client";

import { useState, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { isThemePreference, type ThemePreference } from "@/lib/theme/constants";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; icon: typeof Sun }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

function subscribe() {
  return () => {};
}

function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Common.theme");
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const [open, setOpen] = useState(false);

  const activeTheme: ThemePreference = isThemePreference(theme) ? theme : "system";

  if (!mounted) {
    return <div className={cn("h-8 w-8 rounded-lg border border-border", className)} aria-hidden />;
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn("inline-flex overflow-hidden rounded-lg border border-border p-0.5", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      {OPTIONS.map(({ value, icon: Icon }) => {
        const selected = activeTheme === value;
        const visible = open || selected;

        return (
          <div
            key={value}
            className={cn(
              "overflow-hidden transition-[width,opacity] duration-200 ease-out",
              visible ? "w-7 opacity-100" : "w-0 opacity-0",
            )}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              tabIndex={visible ? 0 : -1}
              aria-hidden={!visible}
              aria-label={t(value)}
              aria-pressed={selected}
              className={cn(
                "size-7 rounded-md transition-none",
                selected
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                !visible && "pointer-events-none",
              )}
              onClick={() => {
                if (!open) {
                  setOpen(true);
                  return;
                }

                setTheme(value);
              }}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
