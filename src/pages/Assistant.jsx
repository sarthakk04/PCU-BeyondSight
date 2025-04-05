import { useState } from "react";
import React from "react";

const Assistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript("");
    setResponse("");
    recognition.start();

    recognition.onresult = async (event) => {
      const userInput = event.results[0][0].transcript;
      setTranscript(userInput);
      setIsListening(false);

      // If the user says "notepad", open the Notepad automation
      if (userInput.toLowerCase().includes("notepad")) {
        await startNotepad();
      } else {
        // Send to Gemini
        const geminiResponse = await fetchGeminiResponse(userInput);
        setResponse(geminiResponse);
        speak(geminiResponse);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setResponse("Sorry, I didn't catch that. Please try again.");
      speak("Sorry, I didn't catch that. Please try again.");
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
      return data.response || "Sorry, I couldn't process that request.";
    } catch (error) {
      console.error("API Error:", error);
      return "Error connecting to the AI service.";
    }
  };

  const startNotepad = async () => {
    try {
      const res = await fetch("http://localhost:5000/start_notepad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      const message = data.message || "Notepad not started.";
      setResponse(message);
      speak(message);
    } catch (error) {
      const errorMessage = "Error starting Notepad.";
      setResponse(errorMessage);
      speak(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
              🧠
            </span>
            BeyondSight Assistant
          </h1>
          <p className="mt-2 opacity-90">Your voice-powered AI companion</p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <button
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className={`w-full py-4 px-6 rounded-lg text-lg font-medium flex items-center justify-center gap-2 transition-all
              ${
                isListening || isSpeaking
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              } text-white`}
          >
            {isListening ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Listening...
              </>
            ) : isSpeaking ? (
              "AI is responding..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                Tap to Speak
              </>
            )}
          </button>

          {/* Conversation Display */}
          <div className="mt-8 space-y-6">
            {transcript && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">You said</span>
                </div>
                <p className="text-gray-800 pl-8">{transcript}</p>
              </div>
            )}

            {response && (
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <div className="bg-blue-50 p-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">AI Response</span>
                </div>
                <p className="text-gray-700 pl-8">{response}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-50 p-4 text-center text-sm text-blue-600">
          Press the button and speak naturally
        </div>
      </div>
    </div>
  );
};

export default Assistant;
