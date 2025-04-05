// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import React from "react";

// const socket = io("http://localhost:5000"); // Update when deployed

// const GlobalChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [nickname, setNickname] = useState(
//     `User${Math.floor(Math.random() * 10000)}`
//   );
//   const [isListening, setIsListening] = useState(false);

//   const recognition = new window.webkitSpeechRecognition();
//   recognition.lang = "en-US";
//   recognition.interimResults = false;

//   const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);

//     // Set an Indian voice if available
//     const voices = synth.getVoices();
//     const indianVoice = voices.find(
//       (v) => v.lang === "en-IN" || v.name.toLowerCase().includes("india")
//     );
//     if (indianVoice) utterance.voice = indianVoice;

//     synth.speak(utterance);
//   };

//   const startListening = () => {
//     setIsListening(true);
//     recognition.start();

//     recognition.onresult = async (event) => {
//       const userInput = event.results[0][0].transcript;
//       setInput(userInput);
//       setIsListening(false);
//       sendMessage(userInput);
//     };

//     recognition.onerror = () => {
//       setIsListening(false);
//       speak("Sorry, I didn’t catch that.");
//     };
//   };

//   useEffect(() => {
//     socket.emit("joinRoom", "global");

//     socket.on("chat message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//       if (msg.from !== nickname) {
//         speak(`${msg.from} says ${msg.text}`);
//       }
//     });

//     return () => {
//       socket.off("chat message");
//     };
//   }, []);

//   const sendMessage = (messageText) => {
//     const msg = messageText || input;
//     if (!msg.trim()) return;

//     const messageObj = {
//       from: nickname,
//       text: msg,
//       room: "global",
//     };

//     socket.emit("chat message", messageObj);
//     setMessages((prev) => [...prev, messageObj]);
//     setInput("");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
//       <h1 className="text-3xl font-bold mb-4">🌐 Global Chatroom</h1>

//       <div className="w-full max-w-xl h-96 overflow-y-auto bg-gray-100 p-4 rounded shadow mb-4">
//         {messages.map((msg, idx) => (
//           <p
//             key={idx}
//             className={`mb-2 ${
//               msg.from === nickname ? "text-blue-600" : "text-green-600"
//             }`}
//           >
//             <strong>{msg.from === nickname ? "You" : msg.from}:</strong>{" "}
//             {msg.text}
//           </p>
//         ))}
//       </div>

//       <div className="flex gap-2 w-full max-w-xl">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-1 px-4 py-2 rounded border"
//         />
//         <button
//           onClick={() => sendMessage()}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Send
//         </button>
//         <button
//           onClick={startListening}
//           disabled={isListening}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//         >
//           🎙️
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GlobalChat;
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import React from "react";

// When deploying, change this to your backend URL
const socket = io("http://localhost:5000");

const GlobalChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState(
    `User${Math.floor(Math.random() * 10000)}`
  );
  const [isListening, setIsListening] = useState(false);

  const recognition =
    typeof window !== "undefined" && window.webkitSpeechRecognition
      ? new window.webkitSpeechRecognition()
      : null;

  if (recognition) {
    recognition.lang = "en-US";
    recognition.interimResults = false;
  }

  const speak = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Set an Indian voice if available
    const voices = synth.getVoices();
    const indianVoice = voices.find(
      (v) => v.lang === "en-IN" || v.name.toLowerCase().includes("india")
    );
    if (indianVoice) utterance.voice = indianVoice;

    synth.speak(utterance);
  };

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

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
      speak("Sorry, I didn't catch that.");
    };
  };

  useEffect(() => {
    // Join the room when component mounts
    socket.emit("join room", "global"); // Changed from "joinRoom" to match server

    // Listen for incoming messages
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.from !== nickname) {
        speak(`${msg.from} says ${msg.text}`);
      }
    });

    return () => {
      socket.off("chat message");
    };
  }, [nickname]);

  const sendMessage = (messageText) => {
    const msg = messageText || input;
    if (!msg.trim()) return;

    const messageObj = {
      from: nickname,
      text: msg,
      room: "global",
    };

    socket.emit("chat message", messageObj);
    setMessages((prev) => [...prev, messageObj]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">🌐 Global Chatroom</h1>

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
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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

export default GlobalChat;
