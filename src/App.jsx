import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaCode,
  FaFileAlt,
  FaChartBar,
  FaSearch,
} from "react-icons/fa";

const glow =
  "shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]";

const Sidebar = () => (
  <div className="w-64 h-screen bg-slate-950 text-white p-6 border-r border-white/10">
    <h1 className="text-2xl font-bold mb-10 text-blue-400">
      DevGenius AI
    </h1>

    <ul className="space-y-6 text-gray-400">
      <li className="text-white font-semibold">Dashboard</li>
      <li className="hover:text-white cursor-pointer">AI Tools</li>
      <li className="hover:text-white cursor-pointer">History</li>
      <li className="hover:text-white cursor-pointer">Billing</li>
    </ul>
  </div>
);

const Navbar = () => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center bg-white/5 backdrop-blur px-4 py-2 rounded-xl w-80 border border-white/10">
      <FaSearch className="text-gray-400" />
      <input
        className="bg-transparent outline-none text-white ml-2 w-full"
        placeholder="Search..."
      />
    </div>

    <div className="flex items-center gap-4">
      <span className="text-white">👤 Mayank</span>
      <div className={`w-10 h-10 bg-blue-500 rounded-full ${glow}`}></div>
    </div>
  </div>
);

const StatCard = ({ title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-white/5 backdrop-blur border border-white/10 p-5 rounded-xl ${glow}`}
  >
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold text-white mt-2">{value}</h2>
  </motion.div>
);

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState("blog");

  const generateAI = async () => {
    if (!prompt) return;

    setLoading(true);
    setResult("");

    let systemPrompt = {
      blog: "Write a professional blog:",
      code: "Write clean code:",
      resume: "Create a resume:",
      analytics: "Analyze data:",
    }[tool];

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      setResult(res.data.choices[0].message.content);
    } catch {
      setResult("❌ Error generating response");
    }

    setLoading(false);
  };

  return (
    <div className="flex bg-gradient-to-br from-black via-slate-950 to-black">
      <Sidebar />

      <div className="flex-1 p-8 min-h-screen text-white">

        <Navbar />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <StatCard title="Generations" value="736" />
          <StatCard title="Words Generated" value="120,458" />
          <StatCard title="Credits Left" value="142" />
        </div>

        {/* AI PANEL */}
        <div className="grid grid-cols-2 gap-8">

          {/* INPUT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
          >
            <h2 className="text-lg font-semibold mb-4">
              AI Generator ✨
            </h2>

            <div className="flex gap-3 mb-4 flex-wrap">
              {[
                ["blog", <FaRobot />, "Blog"],
                ["code", <FaCode />, "Code"],
                ["resume", <FaFileAlt />, "Resume"],
                ["analytics", <FaChartBar />, "Analytics"],
              ].map(([key, icon, label]) => (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  key={key}
                  onClick={() => setTool(key)}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                    tool === key
                      ? "bg-blue-500 " + glow
                      : "bg-slate-800"
                  }`}
                >
                  {icon} {label}
                </motion.button>
              ))}
            </div>

            <textarea
              className="w-full bg-black/40 border border-white/10 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Type something powerful..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateAI}
              className={`mt-4 w-full py-2 rounded-lg bg-blue-500 ${glow}`}
            >
              {loading ? "Generating..." : "Generate AI 🚀"}
            </motion.button>
          </motion.div>

          {/* OUTPUT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
          >
            <h2 className="text-lg font-semibold mb-4">
              Output 💎
            </h2>

            <div className="whitespace-pre-wrap text-gray-300">
              {result || "Your AI magic will appear here..."}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}