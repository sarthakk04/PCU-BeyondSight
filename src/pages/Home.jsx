import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleVoiceCommand = (command) => {
    if (command.includes("voice assistant")) {
      window.location.href = "/assistant";
    } else if (command.includes("chatroom")) {
      window.location.href = "/chatroom";
    } else if (command.includes("global chatroom")) {
      window.location.href = "/globalchat";
    } else if (command.includes("summarizer")) {
      window.location.href = "/summarize";
    } else if (command.includes("settings")) {
      window.location.href = "/settings";
    } else if (command.includes("back")) {
      window.history.back();
    } else if (command.includes("stop") || command.includes("exit")) {
      // Stop the listening when "stop" or "exit" is said
      stopListening();
    }
    // Additional commands can be added here
  };

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("Voice recognition ended");
      if (isListening) {
        recognition.start(); // Restart recognition if it's still listening
      }
    };

    recognition.onerror = (event) => {
      console.log("Error occurred in speech recognition: ", event.error);
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const command = lastResult[0].transcript.toLowerCase();
      setCommand(command);
      handleVoiceCommand(command); // Handle the voice command
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    setIsSpeaking(false);
  };

  const speak = (message) => {
    if (isSpeaking) return; // Prevent multiple speaking events
    setIsSpeaking(true);

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";

    speech.onend = () => {
      setIsSpeaking(false); // Reset speaking state after speech ends
    };

    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    // Start listening when the component mounts
    if (isListening) {
      startListening();
    }

    return () => {
      // Stop listening when the component unmounts
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening]);

  useEffect(() => {
    if (!isListening && !isSpeaking) {
      // Trigger a welcome message when ready to speak or after listening is stopped
      speak("Welcome to BeyondSight! Please start speaking a command.");
    }
  }, [isListening, isSpeaking]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: "1rem",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          zIndex: 10,
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "'Brush Script MT', cursive",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#fff",
            textShadow: "0 0 10px rgba(138, 43, 226, 0.7)",
          }}
        >
          BeyondSight
        </h1>
      </div>
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
        style={{ backgroundColor: "black" }}
      >
        <div className="relative z-10 text-center max-w-5xl w-full">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                BeyondSight
              </span>
            </h1>
            <p className="text-xl text-white drop-shadow-md">
              Empowering blind users with voice-powered communication,
              community, and learning tools.
            </p>
          </div>

          {/* Feature Cards with Routing */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
            <Link
              to="/assistant"
              className="bg-gradient-to-br from-white via-blue-100 to-purple-100 text-black rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🗣️</div>
                <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
                <p className="text-gray-700 text-sm">
                  Hands-free navigation and commands
                </p>
              </div>
            </Link>

            <Link
              to="/chatroom"
              className="bg-gradient-to-br from-white via-blue-100 to-purple-100 text-black rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="text-xl font-semibold mb-2">Private Chatroom</h3>
                <p className="text-gray-700 text-sm">
                  Secure one-on-one conversations
                </p>
              </div>
            </Link>

            <Link
              to="/globalchat"
              className="bg-gradient-to-br from-white via-blue-100 to-purple-100 text-black rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-xl font-semibold mb-2">Global Chatroom</h3>
                <p className="text-gray-700 text-sm">
                  Connect with the community worldwide
                </p>
              </div>
            </Link>

            <Link
              to="/summarize"
              className="bg-gradient-to-br from-white via-blue-100 to-purple-100 text-black rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">📑</div>
                <h3 className="text-xl font-semibold mb-2">Web Summarizer</h3>
                <p className="text-gray-700 text-sm">
                  Get concise summaries of web content
                </p>
              </div>
            </Link>

            <Link
              to="/settings"
              className="bg-gradient-to-br from-white via-blue-100 to-purple-100 text-black rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">⚙️</div>
                <h3 className="text-xl font-semibold mb-2">Offline Chatroom</h3>
                <p className="text-gray-700 text-sm">
                  Local network communication
                </p>
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 text-white text-sm drop-shadow-sm">
            <p>Press any button or use voice commands to begin</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
    