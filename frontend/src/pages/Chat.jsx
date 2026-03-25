import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { askMedicalAI } from "../services/chat";

export default function Chat() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState("这里会显示 DeepSeek 的回复。");

  async function ask() {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await askMedicalAI(q);
      setRes(data.reply || "模型没有返回内容");
    } catch (err) {
      setRes("请求失败：" + err.message);
    }
    setLoading(false);
  }

  return (
    <>
      <PageHeader
        title="AI 助手"
        subtitle="通过后端调用 DeepSeek，避免在前端暴露 API Key。"
      />

      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <input
            className="input"
            placeholder="输入医疗问题，例如：2 型糖尿病患者的 HbA1c 控制目标是什么？"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn primary" onClick={ask} disabled={loading}>
            {loading ? "思考中..." : "提问"}
          </button>
        </div>
        <pre className="chat-box">{res}</pre>
      </div>
    </>
  );
}
