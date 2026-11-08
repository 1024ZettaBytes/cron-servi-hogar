import axios from "axios";
import cron from "node-cron";
import "dotenv/config";

console.log("[*] Started at: ", new Date().toString());
const API_PATH = process.env.NEXTAUTH_URL || "";
//const SORTEAME_API_PATH = process.env.SORTEAME_API_URL || "";

cron.schedule("1 1 * * *", async () => {
  console.log("--> Calling api: ", API_PATH, "...");
  const res = await axios.get(API_PATH + "/api/rents/generateRecord");
  console.log("Finished:  ", res.data);
});

cron.schedule("58 23 * * *", async () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (today.getMonth() !== tomorrow.getMonth()) {
    console.log("--> Calling api for Machines Record: ", API_PATH, "...");
    const res = await axios.get(
      API_PATH + "/api/rents/generateRecord?id=MACHINES_REPORT"
    );
    console.log("Finished Machines Record:  " + res.data);
  }
});

// Health check: enabled with HEALTH_CHECK_ENABLED=true, runs every minute
const HEALTH_CHECK_ENABLED = process.env.HEALTH_CHECK_ENABLED === "true";

if (HEALTH_CHECK_ENABLED) {
  console.log("[*] Health check enabled (every minute)");
  cron.schedule("* * * * *", async () => {
    const url = API_PATH + "/api/health";
    const start = Date.now();
    try {
      const res = await axios.get(url, { timeout: 30000 });
      console.log(
        `[health] OK ${res.status} - ${url} (${Date.now() - start}ms)`
      );
    } catch (err) {
      const status = err.response ? err.response.status : "NO_RESPONSE";
      console.error(
        `[health] FAIL ${status} - ${url} (${Date.now() - start}ms): ${err.message}`
      );
    }
  });
}
/*
cron.schedule("0 * * * *", async () => {
  console.log("--> Calling api for Sorteame: ", SORTEAME_API_PATH, "...");
  const res = await axios.post(SORTEAME_API_PATH + "/api/tickets/expire");
  console.log("Finished Sorteame call:  " + res.data);
});*/
