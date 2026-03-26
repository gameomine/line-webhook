const express = require("express");
const axios   = require("axios");
const app     = express();

app.use(express.json());

const GAS_URL = "https://script.google.com/macros/s/AKfycbzODHYcmsEN1b7juCTT4lvtpt5hDPuR0ACt1wxWKKM4MvW-1bqW6cg_e3LS_I5Ikpc/exec";

// LINE Webhook
app.post("/webhook", async (req, res) => {
  res.status(200).json({ status: "ok" });
  try {
    await axios.post(GAS_URL, req.body, {
      headers: { "Content-Type": "application/json" },
      maxRedirects: 5
    });
  } catch (err) {
    console.error("GAS error:", err.message);
  }
});

// LIFF POST proxy — รับจาก advisor/student LIFF แล้วส่งต่อไป GAS
app.post("/liff", async (req, res) => {
  try {
    const result = await axios.post(GAS_URL, req.body, {
      headers: { "Content-Type": "application/json" },
      maxRedirects: 5
    });
    res.set("Access-Control-Allow-Origin", "*");
    res.json(result.data);
  } catch (err) {
    console.error("LIFF proxy error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// CORS preflight
app.options("/liff", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.sendStatus(200);
});

// Health check
app.get("/", (req, res) => res.send("LINE Webhook Middleware OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
