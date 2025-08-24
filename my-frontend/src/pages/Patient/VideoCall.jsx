import React from "react";
import Sidebar from "../../components/Sidebar";

export default function VideoSession() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7fb" }}>
      <Sidebar active="Consultation" />
      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Video Consultation</h1>
        <p>This is the video session placeholder. UI will load here.</p>
      </main>
    </div>
  );
}
