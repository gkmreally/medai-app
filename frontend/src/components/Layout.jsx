import React from "react";

const items = [
  { id: "dashboard", label: "数据总览" },
  { id: "patients", label: "患者管理" },
  { id: "chat", label: "AI 助手" },
];

export default function Layout({ view, setView, children }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">MedAI</div>
        {items.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${view === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
          >
            {item.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", fontSize: 12, opacity: 0.75 }}>
          Stage 2 · Supabase 持久化版
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
