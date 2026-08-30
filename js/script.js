const CLIENT_ID =
  "196787425473-d7kp514crpb5besfbvp6hkd33fgk4vvb.apps.googleusercontent.com";

const WORKER_URL = "https://worker.seanogmc.workers.dev";
let accessToken = null;

const googleBtn = document.getElementById("signin-btn");

googleBtn.addEventListener("click", () => {
  const client = google.accounts.oauth2.initCodeClient({
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    ux_mode: "popup",
    callback: handleAuthResponse,
  });
  client.requestCode();
});

async function handleAuthResponse(response) {
  const res = await fetch(`${WORKER_URL}/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: response.code, redirect_uri: "postmessage" }),
  });
  const data = await res.json();
  accessToken = data.access_token;
  console.log("Signed in, token ready!");
}
