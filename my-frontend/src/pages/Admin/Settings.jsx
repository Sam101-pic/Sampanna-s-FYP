import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaUserCog, FaFileAlt, FaCog, FaUserCircle, FaSignOutAlt, FaUserCheck,
} from "react-icons/fa";
import {
  FiCheckCircle, FiCpu, FiShield, FiGlobe, FiRefreshCcw, FiSave,
  FiChevronDown, FiBell, FiKey, FiAlertTriangle, FiDatabase, FiEye
} from "react-icons/fi";
import "./Settings.css";

/* ----------------------- mock auth ----------------------- */
function useAuth() {
  const user = { name: "Admin User", role: "Admin" };
  return {
    user,
    logout: () => {
      localStorage.removeItem("token");
      window.location = "/auth/login";
    },
  };
}

/* ----------------------- sidebar ------------------------ */
function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const adminMenu = [
    { label: "Dashboard",               icon: <FaHome />,       to: "/dashboard/admin" },
    { label: "User Management",         icon: <FaUserCog />,    to: "/admin/user-management" },
    { label: "Therapist Verification",  icon: <FaUserCheck />,  to: "/admin/therapist-verification" }, // <-- added
    { label: "Reports",                 icon: <FaFileAlt />,    to: "/admin/reports" },
    { label: "Settings",                icon: <FaCog />,        to: "/admin/settings" },
  ];

  return (
    <aside className="side-nav" aria-label="Admin sidebar">
      <div
        className="side-header"
        onClick={() => navigate("/dashboard/admin")}
        role="button"
        tabIndex={0}
      >
        <span className="side-logo-bg"><FaUserCog className="side-logo" /></span>
        <span className="side-appname">SwasthaMann</span>
        <span className="side-portal">Admin Portal</span>
      </div>

      <nav className="side-menu">
        {adminMenu.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              "side-link" + (isActive || item.label === "Settings" ? " active" : "")
            }
            end
          >
            <span className="side-icon">{item.icon}</span>
            <span className="side-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-bottom">
        <div className="side-user">
          <FaUserCircle className="side-user-icon" />
          <div>
            <div className="side-user-name">{user.name}</div>
            <div className="side-user-role">{user.role}</div>
          </div>
        </div>
        <button className="side-logout" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}

/* ----------------------- small UI helpers ------------------------ */
const Stat = ({ icon, label, value, sub, className = "" }) => (
  <div className={"as-stat " + className}>
    <div className="as-stat-left">
      <div className="as-stat-icon">{icon}</div>
      <div>
        <div className="as-stat-label">{label}</div>
        <div className="as-stat-value">{value}</div>
        {sub ? <div className="as-stat-sub">{sub}</div> : null}
      </div>
    </div>
    <FiCheckCircle className="as-stat-ok" />
  </div>
);

const Card = ({ title, children, right }) => (
  <section className="as-card">
    <div className="as-card-head">
      <h3>{title}</h3>
      {right}
    </div>
    <div className="as-card-body">{children}</div>
  </section>
);

const Field = ({ label, children }) => (
  <label className="as-field">
    <div className="as-label">{label}</div>
    {children}
  </label>
);

const Input = (props) => <input className="as-input" {...props} />;
const Select = ({ children, ...rest }) => (
  <div className="as-select-wrap">
    <select className="as-select" {...rest}>{children}</select>
    <FiChevronDown className="as-select-caret" />
  </div>
);
const Textarea = (props) => <textarea className="as-textarea" {...props} />;

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={"as-toggle " + (checked ? "on" : "off")}
      onClick={() => onChange(!checked)}
      aria-label={label}
    >
      <span className="as-toggle-ball" />
    </button>
  );
}

/* ----------------------- page --------------------------- */
export default function Settings() {
  const [tab, setTab] = useState("general"); // general | security | notifications | integrations | maintenance

  // basic form state (mock)
  const [platform, setPlatform] = useState({
    name: "SwasthaMann",
    email: "support@swasthamaan.com",
    tz: "UTC",
    lang: "English",
    maxDuration: 60,
    timeout: 30,
    concurrent: 1000,
    retention: 365,
  });

  const [security, setSecurity] = useState({
    minLen: 8, maxAttempts: 5, expiryHours: 24, enc: "AES-256",
    twoFA: true, forceSSL: true,
    apiKey: "••••••••••••••••••••••••••••••••••",
    hookKey: "•••••••••••••",
  });

  const [notify, setNotify] = useState({
    email: true, sms: true, adminEmail: "admin@swasthamaan.com", adminPhone: "+1-555-0123",
    alertTpl: `Dear Admin,\n\nA system alert has been triggered: {{alert_message}}\n\nTime: {{timestamp}}\nSeverity: {{severity}}\nAffected Component: {{component}}\n\n— SwasthaMann`,
    welcomeTpl: `Welcome to SwasthaMann!\n\nThank you for joining our platform. Your account has been successfully created.`,
  });

  const [integrations, setIntegrations] = useState({
    payment: "Stripe", email: "SendGrid", sms: "Twilio", video: "Zoom",
  });

  const [maintenance, setMaintenance] = useState({
    maintenanceMode: false, autobackups: true,
    backup: { when: "2 hours ago", size: "2.4 GB", status: "Healthy" },
    logs: { level: "INFO", size: "156 MB", retention: "30 days" },
  });

  const save = () => alert("Settings saved (mock).");
  const reset = () => alert("Reset to defaults (mock).");

  return (
    <div className="as-shell">
      <AdminSidebar />

      <main className="as-main">
        {/* Header */}
        <header className="as-header">
          <div>
            <h1>System Settings</h1>
            <p>Configure platform settings and preferences</p>
          </div>

          <div className="as-actions">
            <button className="as-btn" onClick={reset}><FiRefreshCcw /> Reset to Default</button>
            <button className="as-btn primary" onClick={save}><FiSave /> Save Changes</button>
          </div>
        </header>

        {/* KPI / Stats */}
        <section className="as-stats">
          <Stat icon={<FiCheckCircle />} label="System Status" value="Operational" sub="All systems running" />
          <Stat icon={<FiCpu />}          label="Server Load"    value="23%" />
          <Stat icon={<FiShield />}       label="Security Level" value="High" sub="SSL + 2FA Enabled" />
          <Stat icon={<FiGlobe />}        label="Uptime"         value="99.9%" sub="Last 30 days" />
        </section>

        {/* Tabs */}
        <div className="as-tabs" role="tablist">
          {["general","security","notifications","integrations","maintenance"].map(t => (
            <button key={t}
              className={"as-tab" + (tab===t ? " active": "")}
              onClick={()=>setTab(t)}
              role="tab"
              aria-selected={tab===t}
            >
              {t[0].toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* -------- GENERAL -------- */}
        {tab==="general" && (
          <div className="as-grid">
            <Card title="Platform Configuration">
              <div className="as-grid-2">
                <Field label="Platform Name">
                  <Input value={platform.name} onChange={e=>setPlatform(p=>({...p,name:e.target.value}))} />
                </Field>
                <Field label="Support Email">
                  <Input type="email" value={platform.email} onChange={e=>setPlatform(p=>({...p,email:e.target.value}))} />
                </Field>
                <Field label="Default Timezone">
                  <Select value={platform.tz} onChange={e=>setPlatform(p=>({...p,tz:e.target.value}))}>
                    {["UTC","America/Los_Angeles","America/New_York","Europe/London","Asia/Kathmandu"].map(z=>(
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Default Language">
                  <Select value={platform.lang} onChange={e=>setPlatform(p=>({...p,lang:e.target.value}))}>
                    {["English","Nepali","Hindi","French"].map(z=>(
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </Card>

            <Card title="Session Management">
              <div className="as-grid-2">
                <Field label="Max Session Duration (minutes)">
                  <Input type="number" value={platform.maxDuration} onChange={e=>setPlatform(p=>({...p,maxDuration:+e.target.value}))} />
                </Field>
                <Field label="Session Timeout (minutes)">
                  <Input type="number" value={platform.timeout} onChange={e=>setPlatform(p=>({...p,timeout:+e.target.value}))} />
                </Field>
                <Field label="Max Concurrent Sessions">
                  <Input type="number" value={platform.concurrent} onChange={e=>setPlatform(p=>({...p,concurrent:+e.target.value}))} />
                </Field>
                <Field label="Data Retention (days)">
                  <Input type="number" value={platform.retention} onChange={e=>setPlatform(p=>({...p,retention:+e.target.value}))} />
                </Field>
              </div>
            </Card>
          </div>
        )}

        {/* -------- SECURITY -------- */}
        {tab==="security" && (
          <div className="as-grid">
            <Card title="Authentication & Access">
              <div className="as-grid-2">
                <Field label="Minimum Password Length">
                  <Input type="number" value={security.minLen} onChange={e=>setSecurity(s=>({...s,minLen:+e.target.value}))} />
                </Field>
                <Field label="Max Login Attempts">
                  <Input type="number" value={security.maxAttempts} onChange={e=>setSecurity(s=>({...s,maxAttempts:+e.target.value}))} />
                </Field>
                <Field label="Session Expiry (hours)">
                  <Input type="number" value={security.expiryHours} onChange={e=>setSecurity(s=>({...s,expiryHours:+e.target.value}))} />
                </Field>
                <Field label="Encryption Level">
                  <Select value={security.enc} onChange={e=>setSecurity(s=>({...s,enc:e.target.value}))}>
                    <option>AES-128</option>
                    <option>AES-256</option>
                    <option>ChaCha20</option>
                  </Select>
                </Field>
              </div>

              <div className="as-switches">
                <div className="as-switch">
                  <div>
                    <div className="as-switch-title">Two-Factor Authentication</div>
                    <div className="as-switch-sub">Require 2FA for all admin accounts</div>
                  </div>
                  <Toggle checked={security.twoFA} onChange={(v)=>setSecurity(s=>({...s,twoFA:v}))} label="Two-Factor Authentication" />
                </div>
                <div className="as-switch">
                  <div>
                    <div className="as-switch-title">SSL/TLS Encryption</div>
                    <div className="as-switch-sub">Force HTTPS for all connections</div>
                  </div>
                  <Toggle checked={security.forceSSL} onChange={(v)=>setSecurity(s=>({...s,forceSSL:v}))} label="SSL/TLS Encryption" />
                </div>
              </div>
            </Card>

            <Card title="API & Access Keys" right={<button className="as-btn"><FiKey/> Rotate</button>}>
              <Field label="Primary API Key">
                <div className="as-input-cta">
                  <Input value={security.apiKey} onChange={e=>setSecurity(s=>({...s,apiKey:e.target.value}))} />
                  <button className="as-icon-btn" title="Reveal"><FiEye/></button>
                </div>
              </Field>
              <Field label="Webhook Secret">
                <div className="as-input-cta">
                  <Input value={security.hookKey} onChange={e=>setSecurity(s=>({...s,hookKey:e.target.value}))} />
                  <button className="as-icon-btn" title="Rotate"><FiRefreshCcw/></button>
                </div>
              </Field>

              <div className="as-alert">
                <FiAlertTriangle/> <b>Security Notice:</b> API keys provide full access to your platform. Keep them secure and rotate regularly.
              </div>
            </Card>
          </div>
        )}

        {/* -------- NOTIFICATIONS -------- */}
        {tab==="notifications" && (
          <div className="as-grid">
            <Card title="Notification Preferences">
              <div className="as-accordion">
                <div className="as-acc-row">
                  <div className="as-acc-left"><FiBell/> Email Notifications</div>
                  <Toggle checked={notify.email} onChange={(v)=>setNotify(n=>({...n,email:v}))} label="Email Notifications" />
                </div>
                <div className="as-acc-row">
                  <div className="as-acc-left"><FiBell/> SMS Notifications</div>
                  <Toggle checked={notify.sms} onChange={(v)=>setNotify(n=>({...n,sms:v}))} label="SMS Notifications" />
                </div>
              </div>

              <div className="as-grid-2">
                <Field label="Admin Email">
                  <Input type="email" value={notify.adminEmail} onChange={e=>setNotify(n=>({...n,adminEmail:e.target.value}))} />
                </Field>
                <Field label="Admin Phone">
                  <Input value={notify.adminPhone} onChange={e=>setNotify(n=>({...n,adminPhone:e.target.value}))} />
                </Field>
              </div>
            </Card>

            <Card title="Email Templates">
              <Field label="System Alert Template">
                <Textarea rows={7} value={notify.alertTpl} onChange={e=>setNotify(n=>({...n,alertTpl:e.target.value}))}/>
              </Field>
              <Field label="Welcome Email Template">
                <Textarea rows={5} value={notify.welcomeTpl} onChange={e=>setNotify(n=>({...n,welcomeTpl:e.target.value}))}/>
              </Field>
            </Card>
          </div>
        )}

        {/* -------- INTEGRATIONS -------- */}
        {tab==="integrations" && (
          <div className="as-grid">
            <Card title="Third-Party Services">
              <div className="as-grid-2">
                <Field label="Payment Gateway">
                  <Select value={integrations.payment} onChange={e=>setIntegrations(s=>({...s,payment:e.target.value}))}>
                    {["Stripe","Braintree","Razorpay"].map(x=><option key={x}>{x}</option>)}
                  </Select>
                </Field>
                <Field label="Email Provider">
                  <Select value={integrations.email} onChange={e=>setIntegrations(s=>({...s,email:e.target.value}))}>
                    {["SendGrid","Mailgun","SES"].map(x=><option key={x}>{x}</option>)}
                  </Select>
                </Field>
                <Field label="SMS Provider">
                  <Select value={integrations.sms} onChange={e=>setIntegrations(s=>({...s,sms:e.target.value}))}>
                    {["Twilio","Nexmo","MessageBird"].map(x=><option key={x}>{x}</option>)}
                  </Select>
                </Field>
                <Field label="Video Provider">
                  <Select value={integrations.video} onChange={e=>setIntegrations(s=>({...s,video:e.target.value}))}>
                    {["Zoom","Agora","Vonage"].map(x=><option key={x}>{x}</option>)}
                  </Select>
                </Field>
              </div>
            </Card>

            <Card title="Integration Status">
              <ul className="as-status-list">
                {[
                  {name:"Payment Gateway", sub:integrations.payment},
                  {name:"Email Provider",  sub:integrations.email},
                  {name:"Sms Provider",    sub:integrations.sms},
                  {name:"Video Provider",  sub:integrations.video},
                  {name:"Storage Provider",sub:"AWS-S3"},
                  {name:"Analytics Provider", sub:"Google-Analytics"},
                ].map((r,i)=>(
                  <li key={i} className="as-status-item">
                    <div className="as-dot" /> 
                    <div className="as-status-main">
                      <div className="as-status-name">{r.name}</div>
                      <div className="as-status-sub">{r.sub}</div>
                    </div>
                    <span className="as-chip success">Connected</span>
                    <button className="as-icon-btn" title="Manage"><FaCog/></button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* -------- MAINTENANCE -------- */}
        {tab==="maintenance" && (
          <div className="as-grid">
            <Card title="System Maintenance">
              <div className="as-accordion">
                <div className="as-acc-row warn">
                  <div className="as-acc-left"><FiAlertTriangle/> Maintenance Mode</div>
                  <Toggle checked={maintenance.maintenanceMode} onChange={(v)=>setMaintenance(m=>({...m,maintenanceMode:v}))} label="Maintenance Mode" />
                </div>
                <div className="as-acc-row">
                  <div className="as-acc-left"><FiDatabase/> Automatic Backups</div>
                  <Toggle checked={maintenance.autobackups} onChange={(v)=>setMaintenance(m=>({...m,autobackups:v}))} label="Automatic Backups" />
                </div>
              </div>
            </Card>

            <Card title="Backup & Recovery" right={<button className="as-btn"><FiDatabase/> Create Backup</button>}>
              <div className="as-grid-2">
                <div className="as-box">
                  <div className="as-box-title">Database Backup</div>
                  <div className="as-kv"><b>Last Backup</b><span>{maintenance.backup.when}</span></div>
                  <div className="as-kv"><b>Backup Size</b><span>{maintenance.backup.size}</span></div>
                  <div className="as-kv"><b>Status</b><span className="as-chip success">{maintenance.backup.status}</span></div>
                </div>
                <div className="as-box">
                  <div className="as-box-title">System Logs</div>
                  <div className="as-kv"><b>Log Level</b><span>INFO</span></div>
                  <div className="as-kv"><b>Log Size</b><span>{maintenance.logs.size}</span></div>
                  <div className="as-kv"><b>Retention</b><span>{maintenance.logs.retention}</span></div>
                  <button className="as-btn ghost"><FiEye/> View Logs</button>
                </div>
              </div>

              <div className="as-tasks">
                {[
                  {name:"Daily Database Backup", sub:"Runs every day at 2:00 AM"},
                  {name:"Log Cleanup", sub:"Runs weekly on Sunday"},
                  {name:"System Health Check", sub:"Runs every 5 minutes"},
                ].map((t,i)=>(
                  <div key={i} className="as-task">
                    <div className="as-dot" />
                    <div className="as-task-main">
                      <div className="as-task-name">{t.name}</div>
                      <div className="as-task-sub">{t.sub}</div>
                    </div>
                    <span className="as-chip success">Active</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
