import React from "react";

export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="topbar">
      <div>
        <h1 className="page-title">{title}</h1>
        <div className="page-subtitle">{subtitle}</div>
      </div>
      <div>{right}</div>
    </div>
  );
}
