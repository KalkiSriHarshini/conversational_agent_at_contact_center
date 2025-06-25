const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// ✅ Render requires this!
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(bodyParser.json());

// ✅ Replace with your valid Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyBY5slUED1eNMYm35XHTuGz1V89dboTy70");

// ✅ Root check
app.get("/", (req, res) => {
  res.send("✅ Gemini chatbot backend is deployed and working!");
});

// ✅ API endpoint
app.post("/api/ask", async (req, res) => {
  const question = req.body.question;
  console.log("Received question:", question);

  if (!question) {
    return res.status(400).json({ reply: "❌ No question received." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ✅ Add a strict system prompt
    const prompt = `
You are Dryrobe's official support chatbot. Only answer questions related to:
- Dryrobe products (materials, features, sizes, comparisons)
- Usage instructions or scenarios
- Shipping, delivery, return, and warranty policies

If a user asks something unrelated, respond with:
"I'm here to help with Dryrobe-related queries only. Please ask about our products or services."
`;

    const result = await model.generateContent([
      { role: "user", parts: [{ text: prompt }] },
      { role: "user", parts: [{ text: question }] }
    ]);

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
