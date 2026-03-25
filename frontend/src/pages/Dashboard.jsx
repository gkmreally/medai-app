import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { listPatients } from "../services/patients";
import { listAppointments } from "../services/appointments";

function riskClass(risk) {
  if (risk === "高") return "high";
  if (risk === "中") return "medium";
  return "low";
}

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [pRes, aRes] = await Promise.all([listPatients(), listAppointments()]);
    if (pRes.error) setError(pRes.error.message);
    if (aRes.error) setError((prev) => prev || aRes.error.message);
    setPatients(pRes.data || []);
    setAppointments(aRes.data || []);
  }

  const stats = useMemo(() => {
    const highRisk = patients.filter((p) => p.risk_level === "高").length;
    const today = new Date().toISOString().slice(0, 10);
    const todayVisits = appointments.filter((a) => a.visit_date === today).length;
    return {
      totalPatients: patients.length,
      highRisk,
      todayVisits,
      newThisMonth: patients.filter((p) => {
        const created = (p.created_at || "").slice(0, 7);
        return created === new Date().toISOString().slice(0, 7);
      }).length,
    };
  }, [patients, appointments]);

  return (
    <>
      <PageHeader
        title="数据总览"
        subtitle="患者、风险、复诊数据已切换为 Supabase 持久化存储。"
      />

      {error ? <div className="card" style={{ borderColor: "#fecaca", color: "#991b1b", marginBottom: 16 }}>{error}</div> : null}

      <div className="grid cards">
        <div className="card"><h3>患者总数</h3><div className="kpi">{stats.totalPatients}</div></div>
        <div className="card"><h3>高风险患者</h3><div className="kpi">{stats.highRisk}</div></div>
        <div className="card"><h3>今日复诊</h3><div className="kpi">{stats.todayVisits}</div></div>
        <div className="card"><h3>本月新增</h3><div className="kpi">{stats.newThisMonth}</div></div>
      </div>

      <div className="two-col" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>最新患者</h3>
          <div className="list">
            {patients.length === 0 ? (
              <div className="empty">还没有患者数据，先去“患者管理”新增一条。</div>
            ) : patients.slice(0, 6).map((p) => (
              <div className="list-item" key={p.id}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong>{p.name}</strong>
                  <span className={`badge ${riskClass(p.risk_level)}`}>{p.risk_level || "低"}</span>
                </div>
                <div className="muted" style={{ marginTop: 6 }}>
                  {p.age ? `${p.age} 岁` : "年龄未填"} · {p.gender || "性别未填"} · {p.diagnosis || "诊断未填"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>近期复诊</h3>
          <div className="list">
            {appointments.length === 0 ? (
              <div className="empty">appointments 表为空。你可以在 Supabase 先插入一些复诊记录。</div>
            ) : appointments.slice(0, 6).map((a) => (
              <div className="list-item" key={a.id}>
                <strong>{a.patient_name}</strong>
                <div className="muted" style={{ marginTop: 6 }}>
                  {a.visit_date} · {a.visit_type || "普通复诊"}
                </div>
                {a.note ? <div style={{ marginTop: 8 }}>{a.note}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
