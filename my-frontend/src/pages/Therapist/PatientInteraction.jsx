import React, { useMemo, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHeart, FiHome, FiUser, FiMessageCircle, FiClock,
  FiSearch, FiPhone, FiVideo, FiInfo, FiSend, FiCamera
} from "react-icons/fi";
import "./PatientInteraction.css";

/* ------------------------- mocked auth ------------------------- */
function useAuthLocal() {
  const user = { name: "Dr. Smith", role: "Therapist" };
  const logout = () => { localStorage.removeItem("token"); window.location = "/auth/therapist"; };
  return { user, logout };
}

/* --------------------------- Sidebar --------------------------- */
function SideNav() {
  const { user, logout } = useAuthLocal();
  const navigate = useNavigate();
  const MENU = [
    { label: "Dashboard",           icon: <FiHome/>,          to: "/therapist/dashboard" },
    { label: "Profile",             icon: <FiUser/>,          to: "/therapist/profile" },
    { label: "Patient Interaction", icon: <FiMessageCircle/>, to: "/therapist/patients" },
    { label: "Session History",     icon: <FiClock/>,         to: "/therapist/history" },
  ];
  return (
    <aside className="side-nav" aria-label="Sidebar navigation">
      <div className="side-header" onClick={() => navigate("/")} role="button" tabIndex={0}>
        <span className="side-logo-bg"><FiHeart className="side-logo" /></span>
        <span className="side-appname">SwasthaMann</span>
        <span className="side-portal">Therapist Portal</span>
      </div>

      <nav className="side-menu">
        {MENU.map((m) => (
          <NavLink key={m.label} to={m.to} title={m.label}
            className={({ isActive }) => "side-link" + (isActive ? " active" : "")} end>
            <span className="side-icon">{m.icon}</span>
            <span className="side-text">{m.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-bottom">
        <div className="side-user">
          <div className="side-user-avatar">DS</div>
          <div>
            <div className="side-user-name">{user.name}</div>
            <div className="side-user-role">{user.role}</div>
          </div>
        </div>
        <button className="side-logout" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}

/* ---------------------- sample page data ----------------------- */
const PATIENTS = [
  { id: "p1", name: "John D.",   condition: "Anxiety",   initials: "JD", unread: 2,  lastSeen: "2 hours ago", next: "Jan 15, 2024 • 2:00 PM", total: 8 },
  { id: "p2", name: "Sarah M.",  condition: "Depression",initials: "SM", unread: 0,  lastSeen: "yesterday",    next: "Jan 18, 2024 • 3:30 PM", total: 5 },
  { id: "p3", name: "Michael R.",condition: "Trauma",    initials: "MR", unread: 1,  lastSeen: "3 hours ago",  next: "Jan 20, 2024 • 5:00 PM", total: 2 },
];

const SEED_MESSAGES = {
  p1: [
    { id: 1, from: "john",  text: "Hi Dr. Smith, I wanted to follow up on our last session.", time: "2:30 PM" },
    { id: 2, from: "me",    text: "Hello John, thank you for reaching out. How have you been feeling since our last session?", time: "2:35 PM" },
    { id: 3, from: "john",  text: "I've been practicing the breathing exercises you taught me, and they're really helping with my anxiety.", time: "2:40 PM" },
  ],
  p2: [],
  p3: [],
};

/* --------------------------- Page UI --------------------------- */
export default function PatientInteraction() {
  const [tab, setTab] = useState("chat"); // 'chat' | 'video'
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [messagesById, setMessagesById] = useState(SEED_MESSAGES);
  const [draft, setDraft] = useState("");
  const [triedSendEmpty, setTriedSendEmpty] = useState(false);
  const chatEndRef = useRef(null);

  const patients = useMemo(
    () => PATIENTS.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())),
    [filter]
  );
  const msgs = selected ? (messagesById[selected.id] || []) : [];

  useEffect(() => {
    if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    }, [msgs]);

  const send = () => {
    if (!selected) return;
    if (!draft.trim()) {
      setTriedSendEmpty(true);
      return;
    }
    const list = messagesById[selected.id] || [];
    const now = new Date();
    const hh = now.getHours();
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ampm = hh >= 12 ? "PM" : "AM";
    const h12 = ((hh + 11) % 12) + 1;
    const newMsg = { id: Date.now(), from: "me", text: draft.trim(), time: `${h12}:${mm} ${ampm}` };
    setMessagesById({ ...messagesById, [selected.id]: [...list, newMsg] });
    setDraft("");
    setTriedSendEmpty(false);
  };

  return (
    <div className="ti-shell">
      <SideNav />

      <main className="ti-main">
        {/* Header */}
        <header className="ti-header">
          <div>
            <h1>Patient Interaction</h1>
            <p>Communicate with your patients and manage sessions</p>
          </div>
          <button className="ti-theme" aria-label="Toggle theme">◐</button>
        </header>

        {/* Tabs */}
        <div className="ti-tabs" role="tablist">
          <button className={"ti-tab" + (tab==="chat" ? " active" : "")} onClick={() => setTab("chat")} role="tab" aria-selected={tab==="chat"}>Patient Chat</button>
          <button className={"ti-tab" + (tab==="video" ? " active" : "")} onClick={() => setTab("video")} role="tab" aria-selected={tab==="video"}>Video Sessions</button>
        </div>

        {tab === "chat" ? (
          <section className="ti-grid">
            {/* Patients list */}
            <div className="ti-card ti-list">
              <div className="ti-card-head">
                <h3>Patients</h3>
              </div>
              <div className="ti-search">
                <FiSearch />
                <input placeholder="Search patients..." value={filter} onChange={(e)=>setFilter(e.target.value)} />
              </div>

              <div className="ti-patients">
                {patients.map(p => (
                  <button key={p.id}
                    className={"ti-patient" + (selected?.id===p.id ? " active" : "")}
                    onClick={() => setSelected(p)}
                  >
                    <span className="ti-avatar">{p.initials}</span>
                    <span className="ti-pmeta">
                      <span className="ti-pname">{p.name}</span>
                      <span className="ti-pcond">{p.condition}</span>
                    </span>
                    {p.unread ? <span className="ti-unread">{p.unread}</span> : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat pane */}
            <div className="ti-card ti-chat">
              <div className="ti-chat-head">
                {selected ? (
                  <>
                    <div className="ti-chat-title">
                      <span className="ti-avatar small">{selected.initials}</span>
                      <div>
                        <div className="ti-chat-name">{selected.name}</div>
                        <div className="ti-lastseen">Last seen: {selected.lastSeen}</div>
                      </div>
                    </div>
                    <div className="ti-chat-actions">
                      <button title="Call"><FiPhone /></button>
                      <button title="Start video"><FiVideo /></button>
                      <button title="Patient info"><FiInfo /></button>
                    </div>
                  </>
                ) : (
                  <div className="ti-chat-title"><div className="ti-chat-name">Select a patient</div></div>
                )}
              </div>

              <div className="ti-messages">
                {!selected && (
                  <div className="ti-empty">
                    <FiMessageCircle />
                    <p>Select a patient to start chatting</p>
                  </div>
                )}
                {selected && msgs.map(m => (
                  <div key={m.id} className={"ti-bubble " + (m.from==="me" ? "me" : "them")}>
                    <div className="ti-text">{m.text}</div>
                    <div className="ti-time">{m.time}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="ti-compose">
                <input
                  className={"ti-input" + (triedSendEmpty && !draft.trim() ? " invalid" : "")}
                  placeholder="Type your message..."
                  value={draft}
                  onChange={(e)=>setDraft(e.target.value)}
                  onKeyDown={(e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); }}}
                />
                <button className="ti-send" onClick={send} aria-label="Send"><FiSend /></button>
              </div>
            </div>

            {/* Info panel */}
            <aside className="ti-card ti-info">
              <div className="ti-card-head">
                <h3>Patient Info</h3>
              </div>
              {!selected ? (
                <div className="ti-muted">Patient information will appear here</div>
              ) : (
                <>
                  <dl className="ti-dl">
                    <div><dt>Condition</dt><dd>{selected.condition} Disorder</dd></div>
                    <div><dt>Last Session</dt><dd>January 8, 2024</dd></div>
                    <div><dt>Next Session</dt><dd>{selected.next}</dd></div>
                    <div><dt>Total Sessions</dt><dd>{selected.total} sessions</dd></div>
                  </dl>

                  <div className="ti-qa-col">
                    <button className="ti-btn">Schedule Session</button>
                    <button className="ti-btn">View Notes</button>
                    <button className="ti-btn"><FiVideo /> Start Video Call</button>
                  </div>
                </>
              )}
            </aside>
          </section>
        ) : (
          /* ------------------------ Video Sessions ------------------------ */
          <section className="ti-grid video">
            <div className="ti-card ti-video-main">
              <div className="ti-card-head"><h3>Video Session</h3><span>{selected ? `Session with ${selected.name}` : "—"}</span></div>
              <div className="ti-video-stage">
                <FiCamera className="ti-video-icon" />
                <div className="ti-video-label">No Active Video Session</div>
                <button className="ti-primary">Start Video Session</button>
              </div>
            </div>

            <aside className="ti-card ti-video-aside">
              <div className="ti-card-head"><h3>Today's Sessions</h3></div>
              <div className="ti-vlist">
                {PATIENTS.map(p => (
                  <button key={p.id} className="ti-vitem" onClick={()=>setSelected(p)}>
                    <span className="ti-avatar">{p.initials}</span>
                    <span className="ti-vmeta">
                      <span className="ti-pname">{p.name}</span>
                      <span className="ti-ptime">{p.next?.split("•")[1]?.trim() || "2:00 PM"}</span>
                    </span>
                    <span className="ti-vcam"><FiVideo /></span>
                  </button>
                ))}
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
