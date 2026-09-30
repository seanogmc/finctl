import { getStartOfMonth, getEndOfMonth } from "./util/dates.js";
import { calcPay } from "./util/pay.js";

let accessToken = null;
const googleBtn = document.getElementById("signin-btn");
const shiftList = document.getElementById("shift-list");
const monthRevenue = document.getElementById("month-revenue");

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
  const startOfMonth = getStartOfMonth();
  const endOfMonth = getEndOfMonth();

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
  const shifts = data.items;
  let monthlyRevenue = 0;

  shiftList.textContent = "";

  const formattedShifts = shifts.map((s) => {
    const shiftRevenue = calcPay(s);
    monthlyRevenue += shiftRevenue;
    const startDate = new Date(s.start.dateTime);
    const endDate = new Date(s.end.dateTime);
    const li = document.createElement("li");
    li.textContent = `${startDate.toLocaleDateString("en-GB")}: ${startDate.toLocaleTimeString("en-GB")} - ${endDate.toLocaleTimeString("en-GB")} (£${shiftRevenue})`;

    return li;
  });

  shiftList.append(...formattedShifts);
  monthRevenue.textContent = `This month's pay: £${monthlyRevenue.toFixed(2)}`;
}
