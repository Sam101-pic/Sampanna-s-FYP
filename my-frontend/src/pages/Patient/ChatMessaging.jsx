// src/components/consultation/ChatMessaging.jsx
import React, { useState } from "react";

export default function ChatMessaging() {
  const [messages, setMessages] = useState([
    { from: "therapist", text: "Hello! How are you today?" },
    { from: "patient", text: "I'm feeling a bit anxious." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const val = input.trim();
    if (!val) return;
    setMessages(prev => [...prev, { from: "patient", text: val }]);
    setInput("");
  };

  return (
    <div className="cm-container">
      <div className="cm-window">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`cm-msg ${m.from === "patient" ? "cm-me" : "cm-peer"}`}
          >
            <b>{m.from === "patient" ? "You" : "Therapist"}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="cm-composer">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
