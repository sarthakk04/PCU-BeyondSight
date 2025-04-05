require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mime = require("mime-types");
const fs = require("fs");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Gemini Initialized:", genAI);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    const candidates = result.response.candidates;
    let output = "";

    for (let candidate of candidates) {
      for (let part of candidate.content.parts) {
        if (part.text) {
          output += part.text;
        }

        if (part.inlineData) {
          const filename = `output_${Date.now()}.${mime.extension(
            part.inlineData.mimeType
          )}`;
          fs.writeFileSync(
            filename,
            Buffer.from(part.inlineData.data, "base64")
          );
          console.log(`Output written to: ${filename}`);
        }
      }
    }

    res.json({ response: output });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

module.exports = router;
