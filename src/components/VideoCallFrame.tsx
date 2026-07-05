"use client";

import { useEffect, useRef } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

export default function VideoCallFrame({ roomUrl }: { roomUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<DailyCall | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (!containerRef.current) return;

    let cancelled = false;

    async function setup() {
      const existing = DailyIframe.getCallInstance();
      if (existing) {
        await existing.destroy();
      }

      if (cancelled || !containerRef.current) return;

      const callFrame = DailyIframe.createFrame(containerRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: "100%",
          height: "440px",
          border: "1px solid #262B33",
          borderRadius: "12px",
        },
      });
      frameRef.current = callFrame;
      callFrame.join({ url: roomUrl });
    }

    setup();

    return () => {
      cancelled = true;
      frameRef.current?.destroy();
      frameRef.current = null;
      mountedRef.current = false;
    };
  }, [roomUrl]);

  return <div ref={containerRef} suppressHydrationWarning />;
}