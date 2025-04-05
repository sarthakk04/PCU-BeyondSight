import { useState } from "react";
import React from "react";

const Assistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const startListening = () => {
    setIsListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const userInput = event.results[0][0].transcript;
      setTranscript(userInput);
      setIsListening(false);

      // Send to Gemini (replace with actual API call)
      const geminiResponse = await fetchGeminiResponse(userInput);
      setResponse(geminiResponse);
      speak(geminiResponse);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak("Sorry, I didn’t catch that.");
    };
  };

  const fetchGeminiResponse = async (prompt) => {
    try {
      const res = await fetch("http://localhost:5000/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      return data.response || "Sorry, something went wrong.";
    } catch (error) {
      return "Error talking to the AI.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">🧠 BeyondSight Assistant</h1>

      <button
        onClick={startListening}
        disabled={isListening}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
      >
        {isListening ? "Listening..." : "🎙️ Ask Something"}
      </button>

      <div className="mt-6 w-full max-w-xl bg-gray-100 p-4 rounded shadow">
        <p>
          <strong>You said:</strong> {transcript}
        </p>
        <p className="mt-3">
          <strong>AI says:</strong> {response}
        </p>
      </div>
    </div>
  );
};

export default Assistant;
