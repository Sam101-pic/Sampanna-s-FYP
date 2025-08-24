import React, { useState } from "react";

const EditProfile = ({ userType = "patient" }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // Update logic here
    alert("Profile updated!");
  };

  return (
    <div className="profile-edit">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {userType === "therapist" && (
          <input
            name="specialty"
            placeholder="Specialty"
            value={form.specialty}
            onChange={handleChange}
          />
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
