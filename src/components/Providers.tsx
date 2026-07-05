"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CommandPalette } from "./CommandPalette";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <CommandPalette />
        <Toaster
          theme="system"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--bg-soft)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "13px",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
