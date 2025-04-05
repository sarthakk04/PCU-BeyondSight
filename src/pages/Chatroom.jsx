import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import React from "react";

const socket = io("http://localhost:5000"); // Backend URL

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [isListening, setIsListening] = useState(false);

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
      setInput(userInput);
      setIsListening(false);
      sendMessage(userInput);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak("Sorry, I didn’t catch that.");
    };
  };

  useEffect(() => {
    if (!joined) return;

    socket.emit("joinRoom", room);

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);

      const spoken = `${msg.from} says ${msg.text}`;
      speak(spoken);
    });

    return () => {
      socket.off("chat message");
    };
  }, [joined]);

  const sendMessage = (messageText) => {
    const msg = messageText || input;
    if (!msg.trim()) return;

    const messageObj = {
      from: nickname,
      text: msg,
      room: room,
    };

    socket.emit("chat message", messageObj);
    setMessages((prev) => [...prev, messageObj]);
    setInput("");
  };

  const handleJoin = () => {
    if (!nickname.trim() || !room.trim()) {
      alert("Please enter both nickname and room.");
      return;
    }
    setJoined(true);
  };

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h1 className="text-3xl font-bold mb-4">
          🔐 Join BeyondSight Chatroom
        </h1>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mb-2 px-4 py-2 border rounded w-64"
        />
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="mb-4 px-4 py-2 border rounded w-64"
        />
        <button
          onClick={handleJoin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">
        💬 BeyondSight Chat - Room: {room}
      </h1>

      <div className="w-full max-w-xl h-96 overflow-y-auto bg-gray-100 p-4 rounded shadow mb-4">
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={`mb-2 ${
              msg.from === nickname ? "text-blue-600" : "text-green-600"
            }`}
          >
            <strong>{msg.from === nickname ? "You" : msg.from}:</strong>{" "}
            {msg.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2 w-full max-w-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded border"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
        <button
          onClick={startListening}
          disabled={isListening}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🎙️
        </button>
      </div>
    </div>
  );
};

export default Chatroom;
