// Slack incoming webhooks need no OAuth app — a workspace admin just
// creates one at https://api.slack.com/messaging/webhooks and pastes
// the URL into Settings > Integrations here.
export async function sendSlackMessage(webhookUrl: string, text: string) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}
