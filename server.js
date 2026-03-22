const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// ใส่ GAS Web App URL
const GAS_URL = "https://script.google.com/macros/s/AKfycbwH1U_5pTxSOoseU6djVZEgNS32UbhJZB-bq9zzA0lUXl92x7C1khKB0at4B1T_WJs/exec";

// LINE จะ POST มาที่นี่
app.post("/webhook", async (req, res) => {
  // ต้องตอบ 200 ทันทีก่อนเสมอ
  res.status(200).json({ status: "ok" });

  // แล้วค่อยส่งต่อไป GAS
  try {
    await axios.post(GAS_URL, req.body, {
      headers: { "Content-Type": "application/json" },
      maxRedirects: 5
    });
  } catch (err) {
    console.error("GAS error:", err.message);
  }
});

// Health check
app.get("/", (req, res) => res.send("LINE Webhook Middleware OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
