const DAILY_API = "https://api.daily.co/v1";

export async function createDailyRoom(roomName: string): Promise<string> {
  const res = await fetch(`${DAILY_API}/rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: roomName,
      properties: {
        enable_chat: true,
        enable_screenshare: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
      },
    }),
  });
  if (!res.ok) throw new Error(`Daily.co room creation failed: ${await res.text()}`);
  const data = await res.json();
  return data.url as string;
}
