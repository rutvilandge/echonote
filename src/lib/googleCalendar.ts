import { google } from "googleapis";

export async function createCalendarEvent(
  accessToken: string,
  { title, description, startTime, endTime, meetingUrl }: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    meetingUrl?: string;
  }
) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      description: `${description ?? ""}\n\nJoin: ${meetingUrl ?? ""}`,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
    },
  });
  return event.data;
}
