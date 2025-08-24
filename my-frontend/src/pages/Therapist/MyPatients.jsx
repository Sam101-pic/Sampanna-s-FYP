import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './MyPatients.css';

export default function MyPatients() {
  const userName = 'Dr. Jane Doe';
  const [patients] = useState([
    { name: 'John Smith', lastSession: '2025-07-20', nextSession: '2025-07-28' },
    { name: 'Mary Adams', lastSession: '2025-07-18', nextSession: '2025-07-27' }
  ]);

  return (
    <div className="mp-root">
      <Sidebar active="My Patients" userName={userName} userRole="Therapist" />
      <main className="mp-main">
        <h2>My Patients</h2>
        <div className="mp-list">
          {patients.map((p, i) => (
            <div className="mp-card" key={i}>
              <div className="mp-patient-name">{p.name}</div>
              <div className="mp-patient-info">
                Last session: {p.lastSession} | Next: {p.nextSession}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}