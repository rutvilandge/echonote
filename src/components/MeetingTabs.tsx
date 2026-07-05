"use client";

import { useState } from "react";
import VideoCallFrame from "./VideoCallFrame";
import EmptyState from "./EmptyState";

type Meeting = {
  roomUrl?: string;
  // add other meeting fields you already use here
  [key: string]: any;
};

export default function MeetingTabs({ meeting }: { meeting: Meeting }) {
  const [tab, setTab] = useState("Recording");

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["Recording", "Notes", "Transcript"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontWeight: tab === t ? "bold" : "normal",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Recording" &&
        (meeting.roomUrl ? (
          <VideoCallFrame roomUrl={meeting.roomUrl} />
        ) : (
          <EmptyState text="No video room for this meeting." />
        ))}
    </div>
  );
}