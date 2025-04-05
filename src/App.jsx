import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Assistant from "./pages/Assistant";
import Chatroom from "./pages/Chatroom";
import GlobalChat from "./pages/GlobalChat"; // ✅ New import
import Summarizer from "./pages/Summarizer"; /// ✅ Uncomment if implemented
// import Settings from "./pages/Settings"; // ✅ Uncomment if implemented
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/globalchat" element={<GlobalChat />} />
        {/* ✅ New Global Chat Route */}
        <Route path="/summarize" element={<Summarizer />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
