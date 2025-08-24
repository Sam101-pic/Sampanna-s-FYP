import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FaPaperPlane, FaPaperclip, FaSearch, FaEllipsisH, FaCircle, FaSmile } from "react-icons/fa";
import { io } from "socket.io-client";
import "./ChatRoom.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_BASE.replace(/\/api$/, "");
const socket = io(SOCKET_URL, { withCredentials: true });

export default function ChatRoom({ currentUser }) {
  const { therapistId } = useParams();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const active = useMemo(() => threads.find((t) => t._id === activeId), [threads, activeId]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [activeId, messages]);

  useEffect(() => {
    async function loadThreads() {
      const res = await fetch(`${API_BASE}/chat/threads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setThreads(data.threads || []);
    }
    loadThreads();
  }, []);

  useEffect(() => {
    async function ensureThread() {
      if (!therapistId || !currentUser?._id) return;
      const res = await fetch(`${API_BASE}/chat/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ therapistId }),
      });
      const data = await res.json();
      if (data.thread) {
        setActiveId(data.thread._id);
        setThreads((prev) => (prev.find((t) => t._id === data.thread._id) ? prev : [...prev, data.thread]));
      }
    }
    ensureThread();
  }, [therapistId, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeId) return;
      const res = await fetch(`${API_BASE}/chat/threads/${activeId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMessages(data.messages || []);
    };
    fetchMessages();
  }, [activeId]);

  useEffect(() => {
    if (!currentUser?._id) return;
    socket.emit("join", currentUser._id);

    socket.on("newMessage", ({ threadId, message }) => {
      if (threadId === activeId) setMessages((prev) => [...prev, message]);
      setThreads((prev) => prev.map((t) => (t._id === threadId ? { ...t, lastMessage: message } : t)));
    });

    return () => socket.off("newMessage");
  }, [activeId, currentUser]);

  const onSend = async () => {
    if (!text.trim() || !activeId) return;
    const res = await fetch(`${API_BASE}/chat/threads/${activeId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (res.ok && data.message) setMessages((prev) => [...prev, data.message]);
    setText("");
  };

  return (
    <div className="chat-root">
      <Sidebar active="Consultation" />
      <main className="chat-main">
        <aside className="chat-threads">
          <div className="chat-threads-head">
            <h2>Consultation</h2>
            <button className="icon-btn"><FaEllipsisH /></button>
          </div>
          <div className="chat-search">
            <FaSearch />
            <input placeholder="Search therapist" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
          <div className="chat-thread-list">
            {threads.map((t) => {
              const other = t.participants.find((p) => p._id !== currentUser._id);
              return (
                <button key={t._id} className={`thread ${t._id === activeId ? "is-active" : ""}`} onClick={() => setActiveId(t._id)}>
                  <div className="avatar" />
                  <div className="thread-info">
                    <div className="thread-top">
                      <span className="name">{other?.name || "Unknown"}</span>
                    </div>
                    <div className="thread-bottom">
                      <span className="last">{t.lastMessage?.text || "No messages yet"}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
        <section className="chat-window">
          {active ? (
            <>
              <header className="chat-header">
                <div className="peer-name">
                  {active.participants.find((p) => p._id !== currentUser._id)?.name}
                </div>
              </header>
              <div className="chat-messages" ref={listRef}>
                {messages.map((m) => (
                  <div key={m._id} className={`msg-row ${m.sender?._id === currentUser._id ? "me" : "peer"}`}>
                    <div className="bubble">
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <footer className="chat-composer">
                <textarea rows={1} placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} />
                <button className="send-btn" onClick={onSend}><FaPaperPlane /> Send</button>
              </footer>
            </>
          ) : <div className="chat-empty">Select a thread to start chatting</div>}
        </section>
      </main>
    </div>
  );
}
