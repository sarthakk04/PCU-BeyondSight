import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Change if deployed

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [readyToChat, setReadyToChat] = useState(false);
  const listeningRef = useRef(null); // For tracking current recognition

  // Speak utility that waits for speech to finish
  const speak = (text) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = resolve;
      synth.speak(utterance);
    });
  };

  // One-time listening
  const listenOnce = () => {
    return new Promise((resolve) => {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = () => {
        speak("Sorry, I didn’t catch that. Please try again.").then(() => {
          resolve("");
        });
      };
    });
  };

  // Continuous message listening
  const startListeningForMessage = () => {
    if (isListening) return;

    setIsListening(true);

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    listeningRef.current = recognition;

    recognition.start();

    recognition.onresult = (event) => {
      const msg = event.results[0][0].transcript;
      socket.emit("chat message", { room, user: nickname, text: msg });
      setMessages((prev) => [...prev, { from: "you", text: msg }]);
      setIsListening(false);

      setTimeout(async () => {
        await speak("Say your next message.");
        startListeningForMessage();
      }, 1000);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTimeout(() => {
        speak("Sorry, I didn’t catch that. Try again.").then(() =>
          startListeningForMessage()
        );
      }, 1000);
    };
  };

  // Voice chat setup
  useEffect(() => {
    const setupVoiceChat = async () => {
      await speak("Welcome to BeyondSight chatroom. Please say your nickname.");
      let name = await listenOnce();
      while (!name) name = await listenOnce();
      setNickname(name);

      await speak(`Hello ${name}. Please say the room name you want to join.`);
      let roomName = await listenOnce();
      while (!roomName) roomName = await listenOnce();
      setRoom(roomName);

      socket.emit("join room", roomName);
      await speak(
        `You have joined room ${roomName}. You can now start speaking your message.`
      );

      setReadyToChat(true);
      setTimeout(startListeningForMessage, 1000);
    };

    setupVoiceChat();

    socket.on("chat message", ({ user, text }) => {
      if (user !== nickname) {
        setMessages((prev) => [...prev, { from: user, text }]);
        speak(`${user} says: ${text}`);
      }
    });

    return () => {
      socket.off("chat message");
      if (listeningRef.current) {
        listeningRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">💬 BeyondSight Chatroom</h1>

      <div className="w-full max-w-xl h-96 overflow-y-auto bg-gray-100 p-4 rounded shadow mb-4">
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={`mb-2 ${
              msg.from === "you" ? "text-blue-600" : "text-green-600"
            }`}
          >
            <strong>{msg.from === "you" ? "You" : msg.from}:</strong> {msg.text}
          </p>
        ))}
      </div>

      {/* Optional dev button
      <button
        onClick={startListeningForMessage}
        disabled={isListening || !readyToChat}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        🎙️ Start Talking
      </button>
      */}
    </div>
  );
};

export default Chatroom;
