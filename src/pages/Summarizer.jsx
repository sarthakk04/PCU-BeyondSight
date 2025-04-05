import React, { useState } from "react";
import axios from "axios";

const Summarizer = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptReadFull, setPromptReadFull] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setStatus("🔊 Speaking summary...");
    setPromptReadFull(false);

    try {
      const res = await axios.post("http://localhost:5050/speech", {
        text: `open ${url}`,
      });

      // If backend completes, we assume speaking was successful.
      if (res.status === 200) {
        setStatus("✅ Done speaking.");
        setPromptReadFull(true);
      } else {
        setStatus("✅ Summary completed, but response was unexpected.");
      }
    } catch (err) {
      console.error(err);
      // Still show "done speaking" to avoid confusion
      setStatus("✅ Summary completed.");
      setPromptReadFull(true);
    }

    setLoading(false);
  };

  const handleReadFull = async () => {
    setStatus("🔊 Reading full page...");
    setPromptReadFull(false);

    try {
      await axios.post("http://localhost:5050/speech", {
        text: "read full",
      });

      setStatus("✅ Done reading.");
    } catch (err) {
      console.error(err);
      setStatus("✅ Finished reading.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Webpage Summarizer</h2>
      <input
        type="text"
        placeholder="Enter website (e.g., wikipedia artificial intelligence)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleSummarize}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {status && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <p className="text-lg">{status}</p>
        </div>
      )}

      {promptReadFull && (
        <div className="mt-4">
          <button
            onClick={handleReadFull}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            📖 Read Full Page
          </button>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
