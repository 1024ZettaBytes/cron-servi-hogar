import axios from "axios";
import cron from "node-cron";
import 'dotenv/config'

console.log("[*] Started at: ", new Date().toString());
const API_PATH = process.env.NEXTAUTH_URL || "";

cron.schedule("30 20 * * *", async () => {
  console.log("--> Calling api: ", API_PATH, "...");
  const res = await axios.get(API_PATH + "/api/rents/generateRecord");
  console.log("Finished:  ", res.data);
});
