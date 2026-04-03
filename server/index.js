
// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import connectDB from "./config/db.js";
// import Chat from "./models/Chat.js";
// import { fileURLToPath } from "url";

// // Fix for __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Load .env from correct path
// dotenv.config({ path: path.join(__dirname, ".env") });

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Test route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // AI Route
// app.post("/api/ai", async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     console.log("User message:", message);

//     // ✅ Debug API key
//     console.log("API KEY:", process.env.OPENROUTER_API_KEY);

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-4o-mini",
//         messages: [
//           {
//             role: "user",
//             content: message,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const reply = response.data.choices[0].message.content;

//     console.log("AI reply:", reply);

//     res.json({ reply });
//   } catch (error) {
//     console.error("❌ ERROR:", error.response?.data || error.message);

//     res.status(500).json({
//       error: "Server error",
//       details: error.response?.data || error.message,
//     });
//   }
// });

// // Port
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });







import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ================= DB CONNECT =================
mongoose
  .connect("mongodb://127.0.0.1:27017/ai_saas")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// ================= MODEL =================
const chatSchema = new mongoose.Schema(
  {
    prompt: String,
    reply: String,
    tool: String,
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

// ================= ROUTES =================

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ AI Route (save to DB)
app.post("/api/ai", async (req, res) => {
  try {
    const { message, tool } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("User message:", message);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    console.log("AI reply:", reply);

    // ✅ Save to MongoDB
    const newChat = await Chat.create({
      prompt: message,
      reply,
      tool,
    });

    res.json({ reply, chat: newChat });
  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "Server error",
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Get history
app.get("/api/history", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error("❌ HISTORY ERROR:", error.message);
    res.status(500).json({ error: "Error fetching history" });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});