import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDownload,
  FiChevronDown,
  FiDollarSign,
} from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import paymentService from "../../services/paymentService"; // keep if you have it; page still works without
import "./Payment.css";

/** Mock plans to render the cards */
const PLANS = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 99,
    unit: "/month",
    features: [
      "4 sessions per month",
      "Text chat support",
      "Basic progress tracking",
      "Email support",
    ],
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: 179,
    unit: "/month",
    features: [
      "8 sessions per month",
      "Video & text chat",
      "Advanced progress tracking",
      "Priority support",
      "Session recordings",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 249,
    unit: "/month",
    features: [
      "12 sessions per month",
      "All communication methods",
      "Comprehensive analytics",
      "24/7 priority support",
      "Session recordings",
      "Personalized resources",
    ],
  },
];

/** Simple mock in case API isn't ready */
const mockInvoices = [
  {
    id: "inv_1",
    title: "Session with Dr. Sarah Johnson",
    method: "Credit Card",
    amountCents: 12000,
    status: "completed",
    createdAt: "2024-01-01T09:00:00Z",
  },
  {
    id: "inv_2",
    title: "Standard Plan - Monthly Subscription",
    method: "Credit Card",
    amountCents: 17900,
    status: "completed",
    createdAt: "2023-12-25T09:00:00Z",
  },
  {
    id: "inv_3",
    title: "Session with Dr. Michael Chen",
    method: "PayPal",
    amountCents: 12000,
    status: "completed",
    createdAt: "2023-12-18T09:00:00Z",
  },
  {
    id: "inv_4",
    title: "Session with Dr. Emily Rodriguez",
    method: "Credit Card",
    amountCents: 12000,
    status: "pending",
    createdAt: "2023-12-15T09:00:00Z",
  },
];

export default function Payment() {
  const [tab, setTab] = useState("plans"); // 'plans' | 'session' | 'history'
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // subscription snapshot (mock; wire to API if you track subscriptions)
  const [subscription] = useState({
    planId: "standard",
    name: "Standard Plan",
    details: "8 sessions per month • $179/month",
    nextBilling: "January 25, 2024",
    status: "Active",
  });

  // Pay-per-session form state
  const [ppsTherapist, setPpsTherapist] = useState("");
  const [ppsMethod, setPpsMethod] = useState("");
  const BASE_PRICE = 120;
  const PLATFORM_FEE = 5;
  const TOTAL_PRICE = BASE_PRICE + PLATFORM_FEE;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // If your API exists:
        // const rows = await paymentService.listMy();
        // if (mounted) setInvoices(rows || []);
        if (mounted) setInvoices(mockInvoices);
      } catch {
        if (mounted) setInvoices(mockInvoices);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const exportCSV = () => {
    const header = "Date,Title,Method,Amount,Status\n";
    const lines = invoices
      .map((i) => {
        const date = new Date(i.createdAt).toLocaleDateString();
        const amt = `$${(i.amountCents / 100).toFixed(0)}`;
        return `${date},${i.title},${i.method},${amt},${i.status}`;
      })
      .join("\n");
    const csv = header + lines;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-history.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSelectPlan = async (planId) => {
    // Wire this to your backend (Stripe/whatever)
    alert(`Plan selected: ${planId}. Integrate checkout/session creation here.`);
  };

  const handlePayPerSession = async () => {
    if (!ppsTherapist || !ppsMethod) {
      alert("Please select therapist and payment method.");
      return;
    }
    try {
      // Example flow:
      // const { redirectUrl, clientSecret } = await paymentService.createIntent({ amount: TOTAL_PRICE*100, ... });
      // if (redirectUrl) window.location.href = redirectUrl;
      alert(
        `Creating payment for $${TOTAL_PRICE} with ${ppsMethod} for ${ppsTherapist}.`
      );
    } catch (e) {
      alert("Failed to start payment. Check your payment backend.");
    }
  };

  const popularPlanId = useMemo(
    () => PLANS.find((p) => p.popular)?.id,
    []
  );

  return (
    <div className="pay-root">
      <Sidebar active="Payment" />
      <main className="pay-main">
        <header className="pay-header">
          <h1>Payment &amp; Billing</h1>
          <p>Manage your payments, subscriptions, and billing information</p>
        </header>

        {/* Tabs */}
        <nav className="pay-tabs" role="tablist" aria-label="Payment Sections">
          <button
            role="tab"
            aria-selected={tab === "plans"}
            className={`pay-tab ${tab === "plans" ? "is-active" : ""}`}
            onClick={() => setTab("plans")}
          >
            Subscription Plans
          </button>
          <button
            role="tab"
            aria-selected={tab === "session"}
            className={`pay-tab ${tab === "session" ? "is-active" : ""}`}
            onClick={() => setTab("session")}
          >
            Pay Per Session
          </button>
          <button
            role="tab"
            aria-selected={tab === "history"}
            className={`pay-tab ${tab === "history" ? "is-active" : ""}`}
            onClick={() => setTab("history")}
          >
            Payment History
          </button>
        </nav>

        {/* Panels */}
        {tab === "plans" && (
          <section className="pay-panel">
            {/* Current subscription */}
            <div className="sub-current">
              <div className="sub-current-head">
                <span className="dot" />
                <span>Current Subscription</span>
              </div>

              <div className="sub-current-card">
                <div className="sub-cur-name">{subscription.name}</div>
                <div className="sub-cur-details">{subscription.details}</div>
                <div className="sub-cur-next">
                  Next billing: {subscription.nextBilling}
                </div>
                <div className="sub-cur-actions">
                  <span className="badge-active">{subscription.status}</span>
                  <div className="sub-cur-buttons">
                    <button className="btn-outline" onClick={() => alert("Open change plan modal")}>
                      Change Plan
                    </button>
                    <button className="btn-outline" onClick={() => alert("Open cancel dialog")}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Plans grid */}
            <div className="plans-grid">
              {PLANS.map((p) => (
                <article
                  key={p.id}
                  className={`plan-card ${
                    p.id === popularPlanId ? "is-popular" : ""
                  } ${p.id === subscription.planId ? "is-current" : ""}`}
                >
                  {p.id === popularPlanId && (
                    <div className="plan-badge">Most Popular</div>
                  )}
                  <h3 className="plan-name">{p.name}</h3>
                  <div className="plan-price">
                    <span className="big">${p.price}</span>
                    <span className="unit">{p.unit}</span>
                  </div>

                  <ul className="plan-features">
                    {p.features.map((f, i) => (
                      <li key={i}>
                        <FiCheckCircle className="ok" /> {f}
                      </li>
                    ))}
                  </ul>

                  {p.id === subscription.planId ? (
                    <div className="plan-current-flag">Current Plan</div>
                  ) : (
                    <button
                      className="btn-outline wide"
                      onClick={() => handleSelectPlan(p.id)}
                    >
                      Select Plan
                    </button>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "session" && (
          <section className="pay-split">
            {/* Left: pricing + form */}
            <div className="pps-left">
              <h3 className="panel-title">Pay Per Session</h3>
              <p className="muted">
                Book and pay for individual therapy sessions
              </p>

              <div className="pps-card">
                <div className="pps-row">
                  <span>50-minute session</span>
                  <span>${BASE_PRICE}</span>
                </div>
                <div className="pps-row">
                  <span>Platform fee</span>
                  <span>${PLATFORM_FEE}</span>
                </div>
                <div className="pps-divider" />
                <div className="pps-row total">
                  <span>Total per session</span>
                  <span>${TOTAL_PRICE}</span>
                </div>
              </div>

              <div className="pps-form">
                <label className="pps-label">Select Therapist</label>
                <div className="pps-select">
                  <select
                    value={ppsTherapist}
                    onChange={(e) => setPpsTherapist(e.target.value)}
                  >
                    <option value="">Choose your therapist</option>
                    <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                    <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                    <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                  </select>
                  <FiChevronDown className="sel-caret" />
                </div>

                <label className="pps-label">Payment Method</label>
                <div className="pps-select">
                  <select
                    value={ppsMethod}
                    onChange={(e) => setPpsMethod(e.target.value)}
                  >
                    <option value="">Select payment method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Wallet">Wallet</option>
                  </select>
                  <FiChevronDown className="sel-caret" />
                </div>

                <button className="btn-primary pay-action" onClick={handlePayPerSession}>
                  <FiDollarSign /> Book &amp; Pay for Session
                </button>
              </div>
            </div>

            {/* Right: benefits */}
            <div className="pps-right">
              <h3 className="panel-title">Payment Benefits</h3>

              <div className="benefit">
                <FiCheckCircle className="ok" />
                <div>
                  <div className="b-title">Secure Payments</div>
                  <div className="b-sub">
                    All transactions are encrypted and secure
                  </div>
                </div>
              </div>

              <div className="benefit">
                <FiCheckCircle className="ok" />
                <div>
                  <div className="b-title">Flexible Scheduling</div>
                  <div className="b-sub">
                    Book sessions when you need them
                  </div>
                </div>
              </div>

              <div className="benefit">
                <FiCheckCircle className="ok" />
                <div>
                  <div className="b-title">No Commitment</div>
                  <div className="b-sub">
                    Pay only for the sessions you attend
                  </div>
                </div>
              </div>

              <div className="benefit">
                <FiCheckCircle className="ok" />
                <div>
                  <div className="b-title">Instant Receipts</div>
                  <div className="b-sub">
                    Get receipts immediately after payment
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "history" && (
          <section className="pay-panel">
            <div className="hist-head">
              <div>
                <div className="panel-title">Payment History</div>
                <div className="muted">
                  View all your past payments and transactions
                </div>
              </div>
              <button className="btn-outline" onClick={exportCSV}>
                <FiDownload /> Export
              </button>
            </div>

            <div className="hist-list">
              {loading ? (
                <div className="hist-skel">Loading…</div>
              ) : (
                invoices.map((inv) => (
                  <article key={inv.id} className="hist-item">
                    <div className="hist-left">
                      <div className={`status-icon ${inv.status}`}>
                        {inv.status === "completed" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiClock />
                        )}
                      </div>
                      <div className="hist-body">
                        <div className="hist-title">{inv.title}</div>
                        <div className="hist-sub">
                          {new Date(inv.createdAt).toLocaleDateString()} •{" "}
                          <FiCreditCard /> {inv.method}
                        </div>
                      </div>
                    </div>

                    <div className="hist-right">
                      <div className="hist-amt">
                        ${Math.round(inv.amountCents / 100)}
                      </div>
                      <div
                        className={`hist-status ${
                          inv.status === "completed" ? "ok" : "pending"
                        }`}
                      >
                        {inv.status}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
