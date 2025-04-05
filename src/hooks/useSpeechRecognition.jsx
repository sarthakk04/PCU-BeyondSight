import { useState, useEffect } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

const Assistant = () => {
  const { transcript, listening, error, startListening, stopListening } =
    useSpeechRecognition();
  const [aiResponse, setAiResponse] = useState("");

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  useEffect(() => {
    if (transcript.trim()) {
      fetchGeminiResponse(transcript.trim());
    }
  }, [transcript]);

  const fetchGeminiResponse = async (prompt) => {
    try {
      const res = await fetch("http://localhost:5000/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const response = data.response || "Sorry, something went wrong.";
      setAiResponse(response);
      speak(response);
    } catch (error) {
      setAiResponse("Error connecting to AI.");
      speak("Error connecting to AI.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">🧠 BeyondSight Assistant</h1>

      <button
        onClick={listening ? stopListening : startListening}
        className={`${
          listening ? "bg-red-600" : "bg-blue-600"
        } text-white px-6 py-3 rounded-xl shadow hover:opacity-90 transition`}
      >
        {listening ? "🛑 Stop Listening" : "🎙️ Start Listening"}
      </button>

      {error && <p className="mt-4 text-red-600 text-sm">Error: {error}</p>}

      <div className="mt-6 w-full max-w-xl bg-gray-100 p-4 rounded shadow text-lg">
        <p>
          <strong>You:</strong> {transcript}
        </p>
        <p className="mt-3">
          <strong>AI:</strong> {aiResponse}
        </p>
      </div>
    </div>
  );
};

export default Assistant;
