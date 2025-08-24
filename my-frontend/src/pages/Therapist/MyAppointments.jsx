import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './MyAppointments.css';

export default function MyAppointments() {
  const userName = 'Dr. Jane Doe';
  const [appointments] = useState([
    { patient: 'John Smith', datetime: '2025-07-25 14:00' },
    { patient: 'Mary Adams', datetime: '2025-07-26 10:00' }
  ]);

  return (
    <div className="ma-root">
      <Sidebar active="My Appointments" userName={userName} userRole="Therapist" />
      <main className="ma-main">
        <h2>My Appointments</h2>
        <ul className="ma-list">
          {appointments.map((a, i) => (
            <li className="ma-item" key={i}>
              <span className="ma-patient">{a.patient}</span>
              <span className="ma-datetime">{a.datetime}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
