import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/update-alarm-user", async (req, res) => {
  try {
    const { userId, alarmGroupId, meetingId } = req.body || {};

    if (!userId || !alarmGroupId) {
      return res.status(400).json({ ok: false, error: "Missing params" });
    }

    const url = `https://api.adalo.com/v0/apps/${process.env.ADALO_APP_ID}/collections/${process.env.ADALO_USERS_COLLECTION}/${userId}`;

    console.log("🔑 Using API key prefix:", process.env.ADALO_API_KEY?.slice(0, 6));
    console.log("📦 Full URL:", url);

    const body = {
      "Alarm Group": [alarmGroupId],
      "Meeting Number": meetingId,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.ADALO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    if (!response.ok) {
      return res.status(500).json({ ok: false, error: result });
    }

    res.json({ ok: true, result });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));