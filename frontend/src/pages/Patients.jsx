import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { createPatient, deletePatient, listPatients } from "../services/patients";

const emptyForm = {
  name: "",
  age: "",
  gender: "男",
  phone: "",
  diagnosis: "",
  chief_complaint: "",
  risk_level: "低",
};

function riskClass(risk) {
  if (risk === "高") return "high";
  if (risk === "中") return "medium";
  return "low";
}

export default function Patients() {
  const [form, setForm] = useState(emptyForm);
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await listPatients();
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError("");
    setList(data || []);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("姓名必填");
      return;
    }
    setLoading(true);
    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
      latest_vitals: {},
    };
    const { data, error } = await createPatient(payload);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError("");
    setForm(emptyForm);
    setList((prev) => [data, ...prev]);
  }

  async function remove(id) {
    if (!window.confirm("确定删除这位患者吗？")) return;
    const { error } = await deletePatient(id);
    if (error) {
      setError(error.message);
      return;
    }
    setList((prev) => prev.filter((item) => item.id !== id));
  }

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) =>
      [p.name, p.phone, p.diagnosis, p.chief_complaint]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [list, keyword]);

  return (
    <>
      <PageHeader
        title="患者管理"
        subtitle="患者信息已持久化到 Supabase，可新增、搜索、删除。"
      />

      {error ? <div className="card" style={{ borderColor: "#fecaca", color: "#991b1b", marginBottom: 16 }}>{error}</div> : null}

      <div className="two-col">
        <div className="card">
          <h3>新增患者</h3>
          <form onSubmit={submit} className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <input className="input" placeholder="姓名 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <input className="input" placeholder="年龄" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <select className="select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option>男</option>
              <option>女</option>
            </select>
            <div style={{ gridColumn: "1 / -1" }}>
              <input className="input" placeholder="手机号" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <input className="input" placeholder="诊断" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <textarea className="textarea" placeholder="主诉" value={form.chief_complaint} onChange={(e) => setForm({ ...form, chief_complaint: e.target.value })} />
            </div>
            <select className="select" value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}>
              <option>低</option>
              <option>中</option>
              <option>高</option>
            </select>
            <div className="row">
              <button className="btn primary" disabled={loading}>{loading ? "保存中..." : "保存患者"}</button>
              <button type="button" className="btn secondary" onClick={() => setForm(emptyForm)}>清空</button>
            </div>
          </form>
        </div>

        <div className="card">
          <h3>患者列表</h3>
          <div style={{ marginBottom: 12 }}>
            <input className="input" placeholder="搜索姓名 / 电话 / 诊断 / 主诉" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
          {loading && list.length === 0 ? <div className="empty">加载中...</div> : null}
          {filtered.length === 0 ? (
            <div className="empty">暂无匹配患者</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>年龄</th>
                    <th>性别</th>
                    <th>诊断</th>
                    <th>风险</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.age || "-"}</td>
                      <td>{p.gender || "-"}</td>
                      <td>{p.diagnosis || "-"}</td>
                      <td><span className={`badge ${riskClass(p.risk_level)}`}>{p.risk_level || "低"}</span></td>
                      <td>
                        <button className="btn danger" onClick={() => remove(p.id)}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
