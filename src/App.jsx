import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Assistant from "./pages/Assistant";
import Chatroom from "./pages/Chatroom";
import React from "react";
// Placeholder pages
// const Assistant = () => <div className="p-6">Assistant Page</div>;
// const Chatroom = () => <div className="p-6">Chatroom Page</div>;
// const Summarize = () => <div className="p-6">Summarizer Page</div>;
// const Settings = () => <div className="p-6">Settings Page</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/chatroom" element={<Chatroom />} />
        {/* <Route path="/summarize" element={<Summarize />} />
        <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
