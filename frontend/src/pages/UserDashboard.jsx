import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";


export default function UserDashboard() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        api.get("/user/profile")
            .then(res => setProfile(res.data))
            .catch(err => console.error("Error loading profile", err));
    }, []);

    if (!profile) return <h2>Loading...</h2>;

    return (
        <>
            <div className="dashboard-container">
                <h1 className="dashboard-title">Welcome, {profile.name} 👋</h1>
                <p className="dashboard-subtitle">Manage your profile, orders and settings</p>

                <div className="dashboard-grid">

                    {/* Profile */}
                    <div className="dash-card">
                        <h2>👤 Profile</h2>
                        <p><b>Name:</b> {profile.name}</p>
                        <p><b>Email:</b> {profile.email}</p>
                        <Link to="/profile"><button className="dash-btn">View Profile</button></Link>

                    </div>

                    {/* Orders */}
                    <div className="dash-card">
                        <h2>🛒 My Orders</h2>
                        <p>View order history and track your orders.</p>
                    <Link to="/orders"><button className="dash-btn">View Orders</button></Link>
                    </div>

                    {/* Cart */}
                    <div className="dash-card">
                        <h2>🛍 Saved Cart</h2>
                        <p>Your saved items are ready to checkout.</p>
                        <Link to="/cart"><button className="dash-btn">View Cart</button></Link>
                    </div>

                    {/* Settings */}
                    <div className="dash-card">
                        <h2>⚙️ Settings</h2>
                        <p>Change password and account settings.</p>
                    <Link to="/settings"><button className="dash-btn">Edit Settings</button></Link>

                    </div>

                </div>
            </div>


            {/* Inline CSS */}
            <style>{`
    body {
        background: #f4f4f8;
    }

    .dashboard-container {
        padding: 30px;
        color: #333;
        animation: fadeIn 0.6s ease-in-out;
    }

    .dashboard-title {
        font-size: 2.3rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 5px;
        color: #4b0082; /* Deep Violet */
    }

    .dashboard-subtitle {
        text-align: center;
        font-size: 1.1rem;
        margin-bottom: 30px;
        opacity: 0.7;
        color: #555;
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
        padding: 20px 0;
    }

    .dash-card {
        background: #ffffff;
        padding: 22px;
        border-radius: 16px;
        border: 1px solid #e0d4ff; /* soft violet border */
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        transition: 0.3s ease;
    }

    .dash-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 25px rgba(75, 0, 130, 0.15); /* violet shadow */
    }

    .dash-card h2 {
        margin-top: 0;
        font-size: 1.4rem;
        margin-bottom: 10px;
        color: #4b0082;
    }

    .dash-card p {
        color: #444;
        margin-bottom: 15px;
    }

    .dash-btn {
        padding: 10px 16px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #7a4bff, #4b0082);
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        transition: 0.3s;
        box-shadow: 0 4px 10px rgba(75, 0, 130, 0.2);
    }

    .dash-btn:hover {
        background: linear-gradient(135deg, #916aff, #5a0db2);
        box-shadow: 0 6px 14px rgba(75, 0, 130, 0.25);
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`}</style>

        </>
    );
}
