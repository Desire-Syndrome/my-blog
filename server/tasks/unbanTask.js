const cron = require("node-cron");

const User = require("../models/User.js");


cron.schedule("0 0 * * *", async () => { 
  try {
    const now = new Date();
    const unbanned = await User.updateMany(
      { isBanned: true, banExpiresAt: { $lt: now } },
      { isBanned: false, banExpiresAt: null }
    );
    if (unbanned.modifiedCount > 0) {
      console.log(`[Auto-Unban] ${unbanned.modifiedCount} users unbanned.`);
    }
  } catch (err) {
    console.error("Error in auto-unban task:", err);
  }
});