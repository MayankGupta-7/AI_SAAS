// import { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   FaRobot,
//   FaCode,
//   FaFileAlt,
//   FaChartBar,
//   FaSearch,
// } from "react-icons/fa";

// const glow =
//   "shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]";

// // Sidebar
// const Sidebar = ({ activeTab, setActiveTab }) => (
//   <div className="w-64 h-screen bg-slate-950 text-white p-6 border-r border-white/10">
//     <h1 className="text-2xl font-bold mb-10 text-blue-400">
//       DevGenius AI
//     </h1>

//     <ul className="space-y-6 text-gray-400">
//       {[
//         ["dashboard", "Dashboard"],
//         ["tools", "AI Tools"],
//         ["history", "History"],
//         ["billing", "Billing"],
//       ].map(([key, label]) => (
//         <li
//           key={key}
//           onClick={() => setActiveTab(key)}
//           className={`cursor-pointer ${
//             activeTab === key
//               ? "text-white font-semibold"
//               : "hover:text-white"
//           }`}
//         >
//           {label}
//         </li>
//       ))}
//     </ul>
//   </div>
// );

// // Navbar
// const Navbar = () => (
//   <div className="flex justify-between items-center mb-8">
//     <div className="flex items-center bg-white/5 backdrop-blur px-4 py-2 rounded-xl w-80 border border-white/10">
//       <FaSearch className="text-gray-400" />
//       <input
//         className="bg-transparent outline-none text-white ml-2 w-full"
//         placeholder="Search..."
//       />
//     </div>

//     <div className="flex items-center gap-4">
//       <span className="text-white">👤 Mayank</span>
//       <div className={`w-10 h-10 bg-blue-500 rounded-full ${glow}`}></div>
//     </div>
//   </div>
// );

// // Stats Card
// const StatCard = ({ title, value }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className={`bg-white/5 backdrop-blur border border-white/10 p-5 rounded-xl ${glow}`}
//   >
//     <p className="text-gray-400">{title}</p>
//     <h2 className="text-2xl font-bold text-white mt-2">{value}</h2>
//   </motion.div>
// );

// export default function App() {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const [prompt, setPrompt] = useState("");
//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tool, setTool] = useState("blog");

//   const [history, setHistory] = useState([]);
//   const [credits, setCredits] = useState(150);
//   const [stats, setStats] = useState({
//     generations: 0,
//     words: 0,
//   });
//   const [toolUsage, setToolUsage] = useState({
//     blog: 0,
//     code: 0,
//     resume: 0,
//     analytics: 0,
//   });

//   // ✅ Fetch history from backend
//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/history");
//       setHistory(res.data);

//       // Update stats from DB
//       setStats({
//         generations: res.data.length,
//         words: res.data.reduce(
//           (acc, item) => acc + item.reply.split(" ").length,
//           0
//         ),
//       });

//       // Tool usage
//       const usage = {
//         blog: 0,
//         code: 0,
//         resume: 0,
//         analytics: 0,
//       };

//       res.data.forEach((item) => {
//         if (usage[item.tool] !== undefined) {
//           usage[item.tool]++;
//         }
//       });

//       setToolUsage(usage);

//     } catch (err) {
//       console.error("Error fetching history");
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const mostUsedTool = Object.keys(toolUsage).reduce((a, b) =>
//     toolUsage[a] > toolUsage[b] ? a : b
//   );

//   // ✅ AI call
//   const generateAI = async () => {
//     if (!prompt || credits <= 0) return;

//     setLoading(true);
//     setResult("");

//     let systemPrompt = {
//       blog: "Write a professional blog:",
//       code: "Write clean code:",
//       resume: "Create a resume:",
//       analytics: "Analyze data:",
//     }[tool];

//     try {
//       const res = await axios.post("http://localhost:5000/api/ai", {
//         message: `${systemPrompt} ${prompt}`,
//         tool,
//       });

//       setResult(res.data.reply);

//       // Refresh DB data
//       await fetchHistory();

//       setCredits((prev) => prev - 1);

//     } catch {
//       setResult("❌ Error generating response");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex bg-gradient-to-br from-black via-slate-950 to-black">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="flex-1 p-8 min-h-screen text-white">
//         <Navbar />

//         {/* DASHBOARD */}
//         {activeTab === "dashboard" && (
//           <>
//             <h1 className="text-2xl font-bold mb-2">
//               Welcome back, Mayank 👋
//             </h1>

//             <p className="text-gray-400 mb-6">
//               Here’s your AI activity overview
//             </p>

//             <div className="grid grid-cols-3 gap-6 mb-10">
//               <StatCard title="Generations" value={stats.generations} />
//               <StatCard title="Words Generated" value={stats.words} />
//               <StatCard title="Credits Left" value={credits} />
//             </div>

//             <div className="mb-10">
//               <h2 className="text-lg font-semibold mb-4">
//                 Recent Activity 🕒
//               </h2>

//               {history.length === 0 ? (
//                 <p className="text-gray-500">No activity yet</p>
//               ) : (
//                 history.slice(0, 3).map((item, i) => (
//                   <div key={i} className="bg-white/5 p-4 rounded-xl mb-2">
//                     {item.prompt}
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white/5 p-6 rounded-xl">
//                 <p className="text-gray-400">Most Used Tool</p>
//                 <h3 className="text-xl font-bold mt-2">
//                   {mostUsedTool}
//                 </h3>
//               </div>

//               <div className="bg-white/5 p-6 rounded-xl">
//                 <p className="text-gray-400">Total Usage</p>
//                 <h3 className="text-xl font-bold mt-2">
//                   {stats.generations} requests
//                 </h3>
//               </div>
//             </div>
//           </>
//         )}

//         {/* AI TOOLS */}
//         {activeTab === "tools" && (
//           <div className="grid grid-cols-2 gap-8">
//             <div className="bg-white/5 p-6 rounded-2xl">
//               <h2 className="mb-4 font-semibold">AI Generator ✨</h2>

//               <div className="flex gap-3 mb-4 flex-wrap">
//                 {[
//                   ["blog", <FaRobot />, "Blog"],
//                   ["code", <FaCode />, "Code"],
//                   ["resume", <FaFileAlt />, "Resume"],
//                   ["analytics", <FaChartBar />, "Analytics"],
//                 ].map(([key, icon, label]) => (
//                   <button
//                     key={key}
//                     onClick={() => setTool(key)}
//                     className={`px-3 py-2 rounded-lg ${
//                       tool === key ? "bg-blue-500" : "bg-slate-800"
//                     }`}
//                   >
//                     {icon} {label}
//                   </button>
//                 ))}
//               </div>

//               <textarea
//                 className="w-full bg-black/40 p-3 rounded-lg"
//                 rows="6"
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//               />

//               <button
//                 onClick={generateAI}
//                 className="mt-4 w-full py-2 bg-blue-500 rounded-lg"
//               >
//                 {loading ? "Generating..." : "Generate AI 🚀"}
//               </button>
//             </div>

//             <div className="bg-white/5 p-6 rounded-2xl">
//               <h2 className="mb-4 font-semibold">Output 💎</h2>
//               <div className="whitespace-pre-wrap text-gray-300">
//                 {result || "Your AI magic will appear here..."}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* HISTORY */}
//         {activeTab === "history" && (
//           <div>
//             <h2 className="text-xl mb-4">History 📜</h2>

//             {history.map((item, i) => (
//               <div key={i} className="bg-white/5 p-4 rounded-xl mb-3">
//                 <p className="text-sm text-gray-400">
//                   {item.tool?.toUpperCase()}
//                 </p>

//                 <p>{item.prompt}</p>

//                 <p className="text-gray-400 text-sm mt-2 line-clamp-2">
//                   {item.reply}
//                 </p>

//                 <p className="text-xs text-gray-500 mt-2">
//                   {new Date(item.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* BILLING */}
//         {activeTab === "billing" && (
//           <div>
//             <h2 className="text-xl mb-4">Billing 💳</h2>

//             <div className="bg-white/5 p-6 rounded-xl mb-4">
//               <p className="text-gray-400">Current Plan</p>
//               <h3 className="text-xl font-bold">Free Plan</h3>
//             </div>

//             <div className="bg-white/5 p-6 rounded-xl">
//               <p className="text-gray-400">Credits Left</p>
//               <h3 className="text-xl font-bold">{credits}</h3>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// import { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   FaRobot,
//   FaCode,
//   FaFileAlt,
//   FaChartBar,
//   FaSearch,
// } from "react-icons/fa";

// const glow =
//   "shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]";

// // Sidebar
// const Sidebar = ({ activeTab, setActiveTab }) => {
//   const menuItems = [
//     ["dashboard", "Dashboard"],
//     ["tools", "AI Tools"],
//     ["history", "History"],
//     ["billing", "Billing"],
//   ];

//   return (
//     <div className="w-64 h-screen bg-slate-950 text-white p-6 border-r border-white/10">
//       <h1 className="text-2xl font-bold mb-10 text-blue-400">
//         DevGenius AI
//       </h1>

//       <ul className="space-y-6 text-gray-400">
//         {menuItems.map(([key, label]) => (
//           <li
//             key={key}
//             onClick={() => setActiveTab(key)}
//             className={`cursor-pointer transition ${
//               activeTab === key
//                 ? "text-white font-semibold"
//                 : "hover:text-white"
//             }`}
//           >
//             {label}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// // Navbar
// const Navbar = () => (
//   <div className="flex justify-between items-center mb-8">
//     <div className="flex items-center bg-white/5 backdrop-blur px-4 py-2 rounded-xl w-80 border border-white/10">
//       <FaSearch className="text-gray-400" />
//       <input
//         className="bg-transparent outline-none text-white ml-2 w-full"
//         placeholder="Search..."
//       />
//     </div>

//     <div className="flex items-center gap-4">
//       <span className="text-white">👤 Mayank</span>
//       <div className={`w-10 h-10 bg-blue-500 rounded-full ${glow}`}></div>
//     </div>
//   </div>
// );

// // Stats Card
// const StatCard = ({ title, value }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className={`bg-white/5 backdrop-blur border border-white/10 p-5 rounded-xl ${glow}`}
//   >
//     <p className="text-gray-400">{title}</p>
//     <h2 className="text-2xl font-bold text-white mt-2">{value}</h2>
//   </motion.div>
// );

// export default function App() {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const [prompt, setPrompt] = useState("");
//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tool, setTool] = useState("blog");

//   const [history, setHistory] = useState([]);
//   const [credits, setCredits] = useState(150);

//   const [stats, setStats] = useState({
//     generations: 0,
//     words: 0,
//   });

//   const [toolUsage, setToolUsage] = useState({
//     blog: 0,
//     code: 0,
//     resume: 0,
//     analytics: 0,
//   });

//   // =========================
//   // FETCH HISTORY
//   // =========================
//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/history");

//       const data = res.data || [];

//       setHistory(data);

//       setStats({
//         generations: data.length,
//         words: data.reduce(
//           (acc, item) => acc + (item.reply?.split(" ").length || 0),
//           0
//         ),
//       });

//       const usage = {
//         blog: 0,
//         code: 0,
//         resume: 0,
//         analytics: 0,
//       };

//       data.forEach((item) => {
//         if (usage[item.tool] !== undefined) {
//           usage[item.tool]++;
//         }
//       });

//       setToolUsage(usage);
//     } catch (err) {
//       console.error("Error fetching history:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const mostUsedTool = Object.keys(toolUsage).reduce((a, b) =>
//     toolUsage[a] > toolUsage[b] ? a : b
//   );

//   // =========================
//   // AI GENERATION
//   // =========================
//   const generateAI = async () => {
//     if (!prompt.trim()) return;
//     if (credits <= 0) return;

//     setLoading(true);
//     setResult("");

//     const systemPrompt = {
//       blog: "Write a professional blog:",
//       code: "Write clean code:",
//       resume: "Create a resume:",
//       analytics: "Analyze data:",
//     }[tool];

//     try {
//       const res = await axios.post("http://localhost:5000/api/ai", {
//         message: `${systemPrompt} ${prompt}`,
//         tool,
//       });

//       setResult(res.data.reply || "No response");

//       await fetchHistory();

//       setCredits((prev) => prev - 1);
//     } catch (err) {
//       console.error(err);
//       setResult("❌ Error generating response");
//     }

//     setLoading(false);
//   };

//   // =========================
//   // UI RENDER
//   // =========================
//   return (
//     <div className="flex bg-gradient-to-br from-black via-slate-950 to-black">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="flex-1 p-8 min-h-screen text-white">
//         <Navbar />

//         {/* ================= DASHBOARD ================= */}
//         {activeTab === "dashboard" && (
//           <>
//             <h1 className="text-2xl font-bold mb-2">
//               Welcome back, Mayank 👋
//             </h1>

//             <p className="text-gray-400 mb-6">
//               Here’s your AI activity overview
//             </p>

//             <div className="grid grid-cols-3 gap-6 mb-10">
//               <StatCard title="Generations" value={stats.generations} />
//               <StatCard title="Words Generated" value={stats.words} />
//               <StatCard title="Credits Left" value={credits} />
//             </div>

//             <div className="mb-10">
//               <h2 className="text-lg font-semibold mb-4">
//                 Recent Activity 🕒
//               </h2>

//               {history.length === 0 ? (
//                 <p className="text-gray-500">No activity yet</p>
//               ) : (
//                 history.slice(0, 3).map((item, i) => (
//                   <div key={i} className="bg-white/5 p-4 rounded-xl mb-2">
//                     {item.prompt}
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white/5 p-6 rounded-xl">
//                 <p className="text-gray-400">Most Used Tool</p>
//                 <h3 className="text-xl font-bold mt-2">
//                   {mostUsedTool}
//                 </h3>
//               </div>

//               <div className="bg-white/5 p-6 rounded-xl">
//                 <p className="text-gray-400">Total Usage</p>
//                 <h3 className="text-xl font-bold mt-2">
//                   {stats.generations} requests
//                 </h3>
//               </div>
//             </div>
//           </>
//         )}

//         {/* ================= AI TOOLS ================= */}
//         {activeTab === "tools" && (
//           <div className="grid grid-cols-2 gap-8">
//             <div className="bg-white/5 p-6 rounded-2xl">
//               <h2 className="mb-4 font-semibold">AI Generator ✨</h2>

//               <div className="flex gap-3 mb-4 flex-wrap">
//                 {[
//                   ["blog", <FaRobot />, "Blog"],
//                   ["code", <FaCode />, "Code"],
//                   ["resume", <FaFileAlt />, "Resume"],
//                   ["analytics", <FaChartBar />, "Analytics"],
//                 ].map(([key, icon, label]) => (
//                   <button
//                     key={key}
//                     onClick={() => setTool(key)}
//                     className={`px-3 py-2 rounded-lg ${
//                       tool === key ? "bg-blue-500" : "bg-slate-800"
//                     }`}
//                   >
//                     {icon} {label}
//                   </button>
//                 ))}
//               </div>

//               <textarea
//                 className="w-full bg-black/40 p-3 rounded-lg"
//                 rows="6"
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//               />

//               <button
//                 onClick={generateAI}
//                 className="mt-4 w-full py-2 bg-blue-500 rounded-lg"
//               >
//                 {loading ? "Generating..." : "Generate AI 🚀"}
//               </button>
//             </div>

//             <div className="bg-white/5 p-6 rounded-2xl">
//               <h2 className="mb-4 font-semibold">Output 💎</h2>
//               <div className="whitespace-pre-wrap text-gray-300">
//                 {result || "Your AI magic will appear here..."}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ================= HISTORY ================= */}
//         {activeTab === "history" && (
//           <div>
//             <h2 className="text-xl mb-4">History 📜</h2>

//             {history.map((item, i) => (
//               <div key={i} className="bg-white/5 p-4 rounded-xl mb-3">
//                 <p className="text-sm text-gray-400">
//                   {item.tool?.toUpperCase()}
//                 </p>

//                 <p>{item.prompt}</p>

//                 <p className="text-gray-400 text-sm mt-2 line-clamp-2">
//                   {item.reply}
//                 </p>

//                 <p className="text-xs text-gray-500 mt-2">
//                   {new Date(item.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ================= BILLING ================= */}
//         {activeTab === "billing" && (
//           <div>
//             <h2 className="text-xl mb-4">Billing 💳</h2>

//             <div className="bg-white/5 p-6 rounded-xl mb-4">
//               <p className="text-gray-400">Current Plan</p>
//               <h3 className="text-xl font-bold">Free Plan</h3>
//             </div>

//             <div className="bg-white/5 p-6 rounded-xl">
//               <p className="text-gray-400">Credits Left</p>
//               <h3 className="text-xl font-bold">{credits}</h3>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
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

// Sidebar
const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    ["dashboard", "Dashboard"],
    ["tools", "AI Tools"],
    ["history", "History"],
    ["billing", "Billing"],
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 text-white p-6 border-r border-white/10">
      <h1 className="text-2xl font-bold mb-10 text-blue-400">
        DevGenius AI
      </h1>

      <ul className="space-y-6 text-gray-400">
        {menuItems.map(([key, label]) => (
          <li
            key={key}
            onClick={() => setActiveTab(key)}
            className={`cursor-pointer transition ${
              activeTab === key
                ? "text-white font-semibold"
                : "hover:text-white"
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Navbar
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

// Stats Card
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
  const [activeTab, setActiveTab] = useState("dashboard");

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState("blog");

  const [history, setHistory] = useState([]);
  const [credits, setCredits] = useState(150);

  const [stats, setStats] = useState({
    generations: 0,
    words: 0,
  });

  const [toolUsage, setToolUsage] = useState({
    blog: 0,
    code: 0,
    resume: 0,
    analytics: 0,
  });

  // ================= FIX 1: SAFE HISTORY =================
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history");

      const data = Array.isArray(res.data) ? res.data : [];

      setHistory(data);

      setStats({
        generations: data.length,
        words: data.reduce(
          (acc, item) => acc + (item?.reply?.split(" ").length || 0),
          0
        ),
      });

      const usage = {
        blog: 0,
        code: 0,
        resume: 0,
        analytics: 0,
      };

      data.forEach((item) => {
        if (item?.tool && usage[item.tool] !== undefined) {
          usage[item.tool]++;
        }
      });

      setToolUsage(usage);
    } catch (err) {
      console.error("Error fetching history:", err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ================= FIX 2: SAFE MOST USED TOOL =================
  const mostUsedTool =
    Object.values(toolUsage).some((v) => v > 0)
      ? Object.keys(toolUsage).reduce((a, b) =>
          toolUsage[a] > toolUsage[b] ? a : b
        )
      : "N/A";

  // ================= FIX 3: SAFE AI GENERATION =================
  const generateAI = async () => {
    if (!prompt.trim()) return;
    if (credits <= 0) return;

    setLoading(true);
    setResult("");

    const systemPrompt = {
      blog: "Write a professional blog:",
      code: "Write clean code:",
      resume: "Create a resume:",
      analytics: "Analyze data:",
    }[tool];

    try {
      const res = await axios.post("http://localhost:5000/api/ai", {
        message: `${systemPrompt} ${prompt}`,
        tool,
      });

      setResult(res?.data?.reply || "No response");

      await fetchHistory();

      setCredits((prev) => prev - 1);
    } catch (err) {
      console.error(err);
      setResult("❌ Error generating response");
    }

    setLoading(false);
  };

  return (
    <div className="flex bg-gradient-to-br from-black via-slate-950 to-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-8 min-h-screen text-white">
        <Navbar />

        {activeTab === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, Mayank 👋
            </h1>

            <p className="text-gray-400 mb-6">
              Here’s your AI activity overview
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <StatCard title="Generations" value={stats.generations} />
              <StatCard title="Words Generated" value={stats.words} />
              <StatCard title="Credits Left" value={credits} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl">
                <p className="text-gray-400">Most Used Tool</p>
                <h3 className="text-xl font-bold mt-2">
                  {mostUsedTool}
                </h3>
              </div>

              <div className="bg-white/5 p-6 rounded-xl">
                <p className="text-gray-400">Total Usage</p>
                <h3 className="text-xl font-bold mt-2">
                  {stats.generations} requests
                </h3>
              </div>
            </div>
          </>
        )}

        {/* KEEP REST EXACT SAME UI */}
        {activeTab === "tools" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white/5 p-6 rounded-2xl">
              <h2 className="mb-4 font-semibold">AI Generator ✨</h2>

              <textarea
                className="w-full bg-black/40 p-3 rounded-lg"
                rows="6"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <button
                onClick={generateAI}
                className="mt-4 w-full py-2 bg-blue-500 rounded-lg"
              >
                {loading ? "Generating..." : "Generate AI 🚀"}
              </button>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl">
              <h2 className="mb-4 font-semibold">Output 💎</h2>
              <div className="whitespace-pre-wrap text-gray-300">
                {result || "Your AI magic will appear here..."}
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 className="text-xl mb-4">History 📜</h2>

            {history.map((item, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-xl mb-3">
                <p>{item.prompt}</p>
                <p className="text-gray-400 text-sm">{item.reply}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "billing" && (
          <div>
            <h2 className="text-xl mb-4">Billing 💳</h2>

            <div className="bg-white/5 p-6 rounded-xl">
              Credits Left: {credits}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}