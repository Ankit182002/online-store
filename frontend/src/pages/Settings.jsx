import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Settings() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        api.get("/user/profile")
            .then(res => {
                setProfile(res.data);
                setForm({
                    name: res.data.name,
                    email: res.data.email,
                    password: ""
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMsg("");

        try {
            await api.put("/user/profile", form);
            setMsg("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            setMsg("Failed to update profile");
        }
    };

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading Settings...</h2>;

    return (
        <div className="settings" style={{
            maxWidth: 600,
            margin: "40px auto",
            background: "#fff",
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
            <h1 style={{ color: "#4b0082", textAlign: "center" }}>⚙️ Account Settings</h1>

            {msg && <p style={{ textAlign: "center", color: "green" }}>{msg}</p>}

            <form onSubmit={handleSave}>

                <label>Name</label>
                <input
                    style={inputStyle}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <label>Email</label>
                <input
                    style={inputStyle}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>New Password (optional)</label>
                <input
                    style={inputStyle}
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    value={form.password}
                    onChange={handleChange}
                />

                <button style={btnStyle}>Save Changes</button>
            </form>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px"
};

const btnStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #916aff, #5a0db2)",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer"
};
