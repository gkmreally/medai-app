import React, { useState } from "react";
import "./styles.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Chat from "./pages/Chat";

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <Layout view={view} setView={setView}>
      {view === "dashboard" && <Dashboard />}
      {view === "patients" && <Patients />}
      {view === "chat" && <Chat />}
    </Layout>
  );
}
