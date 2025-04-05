// import React, { useState } from "react";
// import axios from "axios";

// const Summarizer = () => {
//   const [url, setUrl] = useState("");
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [promptReadFull, setPromptReadFull] = useState(false);

//   const handleSummarize = async () => {
//     setLoading(true);
//     setStatus("🔊 Speaking summary...");
//     setPromptReadFull(false);

//     try {
//       const res = await axios.post("http://localhost:5050/speech", {
//         text: `open ${url}`,
//       });

//       // If backend completes, we assume speaking was successful.
//       if (res.status === 200) {
//         setStatus("✅ Done speaking.");
//         setPromptReadFull(true);
//       } else {
//         setStatus("✅ Summary completed, but response was unexpected.");
//       }
//     } catch (err) {
//       console.error(err);
//       // Still show "done speaking" to avoid confusion
//       setStatus("✅ Summary completed.");
//       setPromptReadFull(true);
//     }

//     setLoading(false);
//   };

//   const handleReadFull = async () => {
//     setStatus("🔊 Reading full page...");
//     setPromptReadFull(false);

//     try {
//       await axios.post("http://localhost:5050/speech", {
//         text: "read full",
//       });

//       setStatus("✅ Done reading.");
//     } catch (err) {
//       console.error(err);
//       setStatus("✅ Finished reading.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Webpage Summarizer</h2>
//       <input
//         type="text"
//         placeholder="Enter website (e.g., wikipedia artificial intelligence)"
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//         className="border p-2 w-full mb-4"
//       />
//       <button
//         onClick={handleSummarize}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//         disabled={loading}
//       >
//         {loading ? "Summarizing..." : "Summarize"}
//       </button>

//       {status && (
//         <div className="mt-4 p-4 border rounded bg-gray-100">
//           <p className="text-lg">{status}</p>
//         </div>
//       )}

//       {promptReadFull && (
//         <div className="mt-4">
//           <button
//             onClick={handleReadFull}
//             className="bg-green-600 text-white px-4 py-2 rounded"
//           >
//             📖 Read Full Page
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Summarizer;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Moving gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30 animate-pulse bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400"></div>
        <div className="absolute inset-0 opacity-20 animate-pulse delay-700 bg-gradient-to-br from-blue-100 via-white to-blue-200"></div>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8 m-4 max-w-xl w-full z-10 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Webpage Summarizer
          </h2>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Enter website (e.g., wikipedia artificial intelligence)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border border-blue-200 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        <button
          onClick={handleSummarize}
          className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:translate-y-px hover:shadow-lg ${
            loading ? "opacity-80" : "hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Summarizing...
            </span>
          ) : (
            "Summarize"
          )}
        </button>

        {status && (
          <div className="mt-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
            <p className="text-lg text-gray-800">{status}</p>
          </div>
        )}

        {promptReadFull && (
          <div className="mt-6">
            <button
              onClick={handleReadFull}
              className="w-full bg-black text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:translate-y-px hover:bg-gray-800 flex items-center justify-center"
            >
              <span className="mr-2">📖</span> Read Full Page
            </button>
          </div>
        )}

        <div className="mt-6 text-xs text-center text-gray-500">
          Enter any website query and get an audio summary
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
