import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

app.get("/api/health", (req, res) => {
  res.json({ ok: true, provider: "deepseek", hasKey: Boolean(DEEPSEEK_API_KEY) });
});

app.post("/api/ai/chat", async (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ reply: "message 不能为空" });
  }

  if (!DEEPSEEK_API_KEY) {
    return res.json({
      reply: "当前未配置 DEEPSEEK_API_KEY，所以返回的是占位回复。请在 backend/.env 中填写真实 key。\n\n你的问题是：\n" + message
    });
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "你是一位谨慎、专业的慢病管理医学助手。回答要清晰、结构化，不要编造检查结果。"
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "模型没有返回内容";
    res.json({ reply, raw: data });
  } catch (err) {
    res.status(500).json({ reply: "DeepSeek 调用失败：" + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`MedAI backend listening on http://localhost:${PORT}`);
});
