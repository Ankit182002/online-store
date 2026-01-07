import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(true);

    // Fetch profile
    useEffect(() => {
        api.get("/user/profile")
            .then(res => {
                setProfile(res.data);
                setForm({
                    name: res.data.name,
                    email: res.data.email,
                });
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // Handle form change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Save profile
    const saveProfile = () => {
        api.put("/user/profile", form)
            .then(res => {
                setProfile(res.data);
                setEditing(false);
            })
            .catch(err => console.error(err));
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>👤 My Profile</h2>

                {!editing ? (
                    <>
                        <p><b>Name:</b> {profile.name}</p>
                        <p><b>Email:</b> {profile.email}</p>

                        <button style={styles.editBtn} onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    </>
                ) : (
                    <>
                        <label style={styles.label}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <button style={styles.saveBtn} onClick={saveProfile}>
                            Save Changes
                        </button>

                        <button style={styles.cancelBtn} onClick={() => setEditing(false)}>
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// Inline CSS
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        marginTop: "40px",
    },
    card: {
        width: "400px",
        padding: "25px",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0px 3px 12px rgba(0,0,0,0.15)",
    },
    title: {
        marginBottom: "20px",
        fontSize: "22px",
        fontWeight: "bold",
    },
    label: {
        marginTop: "10px",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    editBtn: {
        marginTop: "20px",
        padding: "10px",
        width: "100%",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    saveBtn: {
        marginTop: "20px",
        padding: "10px",
        width: "100%",
        background: "green",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    cancelBtn: {
        marginTop: "10px",
        padding: "10px",
        width: "100%",
        background: "red",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
};
