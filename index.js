import axios from "axios";
import cron from "node-cron";
import "dotenv/config";

console.log("[*] Started at: ", new Date().toString());
const API_PATH = process.env.NEXTAUTH_URL || "";
const SORTEAME_API_PATH = process.env.SORTEAME_API_URL || "";

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

cron.schedule("0 * * * *", async () => {
  console.log("--> Calling api for Sorteame: ", SORTEAME_API_PATH, "...");
  const res = await axios.post(SORTEAME_API_PATH + "/api/tickets/expire");
  console.log("Finished Sorteame call:  " + res.data);
});
