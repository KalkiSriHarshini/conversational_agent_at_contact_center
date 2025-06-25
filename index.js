const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5500;

app.use(cors());
app.use(bodyParser.json());

// ✅ Replace with your valid Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyBY5slUED1eNMYm35XHTuGz1V89dboTy70");

// ✅ Add this route to respond when browser visits root URL
app.get("/", (req, res) => {
  res.send("✅ Gemini chatbot backend is running.");
});

app.post("/api/ask", async (req, res) => {
  const question = req.body.question;
  console.log("Received question:", question);

  if (!question) {
    return res.status(400).json({ reply: "❌ No question received." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    res.status(500).json({ reply: "❌ Gemini: Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
