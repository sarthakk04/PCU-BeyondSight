// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import React from "react";

// // When deploying, change this to your backend URL
// const socket = io("http://localhost:5000");

// const GlobalChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [nickname, setNickname] = useState(
//     `User${Math.floor(Math.random() * 10000)}`
//   );
//   const [isListening, setIsListening] = useState(false);

//   const recognition =
//     typeof window !== "undefined" && window.webkitSpeechRecognition
//       ? new window.webkitSpeechRecognition()
//       : null;

//   if (recognition) {
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//   }

//   const speak = (text) => {
//     if (typeof window === "undefined" || !window.speechSynthesis) return;

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
//     if (!recognition) {
//       alert("Speech recognition is not supported in this browser");
//       return;
//     }

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
//       speak("Sorry, I didn't catch that.");
//     };
//   };

//   useEffect(() => {
//     // Join the room when component mounts
//     socket.emit("joinroom", "global");

//     // Listen for incoming messages
//     socket.on("chat message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//       if (msg.from !== nickname) {
//         speak(`${msg.from} says ${msg.text}`);
//       }
//     });

//     return () => {
//       socket.off("chat message");
//     };
//   }, [nickname]);

//   const sendMessage = (messageText) => {
//     const msg = messageText || input;
//     if (!msg.trim()) return;

//     const messageObj = {
//       from: nickname,
//       text: msg,
//       room: "global",
//     };

//     socket.emit("chat message", messageObj);
//     setInput("");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
//       <h1 className="text-3xl font-bold mb-4">🌐 Global Chatroom</h1>

//       {/* Displaying the nickname */}
//       <div className="mb-4 text-lg text-gray-600">
//         Your nickname: {nickname}
//       </div>

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
//           onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [tempNickname, setTempNickname] = useState("");

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
    // Join the room when component mounts - keeping original "joinroom" event name
    socket.emit("joinroom", "global");

    // Listen for incoming messages
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.from !== nickname) {
        speak(`User says ${msg.text}`);
      }
    });

    return () => {
      socket.off("chat message");
    };
  }, [nickname]);

  const saveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname);
    }
    setShowNicknameModal(false);
  };

  const sendMessage = (messageText) => {
    const msg = messageText || input;
    if (!msg.trim()) return;

    // Using the original messageObj structure
    const messageObj = {
      from: nickname,
      text: msg,
      room: "global",
      timestamp: new Date().toISOString(),
    };

    socket.emit("chat message", messageObj);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #e0f7ff 0%, #87CEEB 50%, #1e3c72 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              backgroundColor: i % 2 === 0 ? "white" : "#0a4c81",
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%)`,
              filter: "blur(30px)",
              animation: `float ${
                Math.random() * 10 + 15
              }s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        className="fixed top-0 left-0 w-full z-20 px-4 py-3"
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Brush Script MT', cursive",
              color: "#0a192f",
              textShadow: "0 2px 4px rgba(255, 255, 255, 0.3)",
            }}
          >
            🌐 Global Chatroom
          </h1>

          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 rounded-full"
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(10, 25, 47, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <span className="text-navy-800 mr-2">Chatting as:</span>
              <span className="text-navy-900 font-bold">{nickname}</span>
            </div>
            <button
              onClick={() => setShowNicknameModal(true)}
              className="text-xs text-navy-800 hover:text-white px-2 py-1 rounded transition-colors"
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(10, 25, 47, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div
        className="relative z-10 mt-20 w-full max-w-4xl rounded-xl shadow-xl overflow-hidden"
        style={{
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className="p-3 flex items-center"
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(10, 25, 47, 0.2)",
          }}
        >
          <div className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <h2 className="text-lg font-semibold text-navy-900">
            🌐 Global Chatroom • {messages.length} messages
          </h2>
        </div>

        {/* Messages */}
        <div
          className="h-96 overflow-y-auto p-4 space-y-3"
          style={{
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            scrollBehavior: "smooth",
          }}
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-navy-800 opacity-70">
              <div className="text-6xl mb-4">💬</div>
              <p>No messages yet. Start the conversation!</p>
              <p className="text-sm mt-2">
                Use the microphone button to speak your message
              </p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isOwnMessage = msg.from === nickname;
            return (
              <div
                key={idx}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md rounded-lg px-4 py-2 shadow-md ${
                    isOwnMessage ? "rounded-tr-none" : "rounded-tl-none"
                  }`}
                  style={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: isOwnMessage
                      ? "rgba(10, 25, 47, 0.6)"
                      : "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: isOwnMessage ? "white" : "#0a192f",
                  }}
                >
                  <div
                    className={`text-xs mb-1 ${
                      isOwnMessage ? "text-blue-100" : "text-navy-700"
                    }`}
                  >
                    {nickname}: {formatTime(msg.timestamp)}
                  </div>
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div
          className="p-3 border-t"
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#0a192f",
              }}
            />
            <button
              onClick={() => sendMessage()}
              className="px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(10, 25, 47, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
            >
              Send
            </button>
            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-105`}
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: isListening
                  ? "rgba(66, 153, 225, 0.7)"
                  : "rgba(10, 25, 47, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
                animation: isListening ? "pulse 1.5s infinite" : "none",
              }}
            >
              🎙️
            </button>
          </div>
          <p className="text-xs mt-2 ml-2" style={{ color: "#0a192f" }}>
            {isListening
              ? "Listening..."
              : "Press the microphone button to speak your message"}
          </p>
        </div>
      </div>

      {/* Nickname Modal Overlay */}
      {showNicknameModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          {/* Animated modal background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient overlay with blur */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(30, 60, 114, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%)",
                backdropFilter: "blur(8px)",
              }}
            ></div>

            {/* Animated dots/stars in the background */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor:
                    i % 3 === 0
                      ? "#ffffff"
                      : i % 3 === 1
                      ? "#87CEEB"
                      : "#1e3c72",
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `twinkle ${
                    Math.random() * 5 + 2
                  }s infinite ease-in-out`,
                }}
              />
            ))}

            {/* Animated light beams */}
            <div
              className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(135, 206, 235, 0.15) 0%, transparent 70%)",
                animation: "pulse-slow 4s infinite ease-in-out",
              }}
            ></div>
          </div>

          {/* Modal Content */}
          <div
            className="rounded-xl p-6 max-w-md w-full shadow-2xl relative z-10"
            style={{
              backdropFilter: "blur(16px)",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              animation: "fade-in 0.3s ease-out",
            }}
          >
            {/* Decorative element */}
            <div
              className="absolute -top-10 -left-10 w-20 h-20 rounded-full opacity-50"
              style={{
                background: "linear-gradient(135deg, #87CEEB, #1e3c72)",
                filter: "blur(20px)",
              }}
            ></div>

            <h2 className="text-2xl font-bold text-center mb-6 text-navy-900">
              Choose Your Nickname
            </h2>
            <input
              type="text"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value)}
              placeholder={nickname}
              className="w-full px-4 py-3 rounded-lg mb-6 focus:outline-none"
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#0a192f",
              }}
              onKeyPress={(e) => e.key === "Enter" && saveNickname()}
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowNicknameModal(false)}
                className="px-6 py-2 rounded-lg transition-colors"
                style={{
                  backdropFilter: "blur(5px)",
                  backgroundColor: "rgba(100, 100, 100, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveNickname}
                className="px-6 py-2 rounded-lg transition-colors"
                style={{
                  backdropFilter: "blur(5px)",
                  backgroundColor: "rgba(10, 25, 47, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              >
                Save Nickname
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className="absolute bottom-4 text-center text-xs z-10"
        style={{ color: "#0a192f" }}
      >
        <p>Global Chat Interface • Speak your mind, hear the world</p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%);
          }
          50% {
            transform: translate(-50%, -60%);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1) translate(-50%, -50%);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2) translate(-42%, -42%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GlobalChat;
