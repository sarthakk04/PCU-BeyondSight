import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        👁️‍🗨️ Welcome to BeyondSight
      </h1>
      <p className="text-gray-600 mb-8 text-lg text-center max-w-md">
        Empowering blind users with voice-powered communication, community, and
        learning tools.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/assistant"
          className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow hover:bg-blue-700 transition"
        >
          🗣️ Voice Assistant
        </Link>
        <Link
          to="/chatroom"
          className="bg-green-600 text-white px-6 py-4 rounded-xl shadow hover:bg-green-700 transition"
        >
          💬 Community Chatroom
        </Link>
        <Link
          to="/summarize"
          className="bg-purple-600 text-white px-6 py-4 rounded-xl shadow hover:bg-purple-700 transition"
        >
          📑 Web Summarizer
        </Link>
        <Link
          to="/settings"
          className="bg-gray-800 text-white px-6 py-4 rounded-xl shadow hover:bg-gray-900 transition"
        >
          ⚙️ Accessibility Settings
        </Link>
      </div>
    </div>
  );
};

export default Home;
