let accessToken = null;
const googleBtn = document.getElementById("signin-btn");

googleBtn.addEventListener("click", () => {
  const client = google.accounts.oauth2.initCodeClient({
    client_id: CONFIG.CLIENT_ID,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    ux_mode: "popup",
    callback: handleAuthResponse,
  });
  client.requestCode();
});

async function handleAuthResponse(response) {
  const res = await fetch(`${CONFIG.WORKER_URL}/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: response.code, redirect_uri: "postmessage" }),
  });
  const data = await res.json();
  accessToken = data.access_token;
  console.log("Signed in, token ready");
  fetchCalendarEvents();
}

async function fetchCalendarEvents() {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();

  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString();

  const params = new URLSearchParams({
    timeMin: startOfMonth,
    timeMax: endOfMonth,
    singleEvents: "true",
    orderBy: "startTime",
  });

  const result = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CONFIG.CALENDAR_ID)}/events?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const data = await result.json();
  console.log("Calendar events:", data.items);
  return data.items;
}
