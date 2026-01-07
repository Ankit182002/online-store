import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="dashboard-container">

            {/* Inline CSS */}
            <style>{`
                .dashboard-container {
                    padding: 30px;
                    animation: fadeIn .5s ease-in-out;
                }
                .admin-title {
                    text-align: center;
                    font-size: 2.3rem;
                    font-weight: 700;
                    color: #4b0082;
                }
                .admin-subtitle {
                    text-align: center;
                    opacity: .7;
                    margin-bottom: 30px;
                }
                .admin-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 25px;
                }
                .admin-card {
                    background: #fff;
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid #e0d4ff;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
                    transition: .3s ease;
                }
                .admin-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 10px 20px rgba(75,0,130,0.15);
                }
                .admin-card h2 {
                    margin: 0 0 10px;
                    color: #4b0082;
                }
                .admin-btn {
                    margin-top: 15px;
                    display: inline-block;
                    padding: 10px 16px;
                    border-radius: 10px;
                    background: linear-gradient(135deg,#7a4bff,#4b0082);
                    color: #fff;
                    font-weight: 600;
                    text-decoration: none;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(75,0,130,.2);
                    transition: .3s ease;
                }
                .admin-btn:hover {
                    box-shadow: 0 6px 14px rgba(75,0,130,.25);
                    background: linear-gradient(135deg,#916aff,#5a0db2);
                }
            `}</style>

            {/* Header */}
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage products, orders, and users</p>

            {/* Admin Options */}
            <div className="admin-grid">

                {/* Products */}
                <div className="admin-card">
                    <h2>Products</h2>
                    <p>Add, edit, update, or delete products.</p>
                    <Link to="/admin/products" className="admin-btn">
                        Manage Products
                    </Link>
                </div>

                {/* Orders */}
                <div className="admin-card">
                    <h2>Orders</h2>
                    <p>View all user orders and update order status.</p>
                    <Link to="/admin/orders" className="admin-btn">
                        Manage Orders
                    </Link>
                </div>

                {/* Users (optional) */}
                <div className="admin-card">
                    <h2>Users</h2>
                    <p>View or manage registered users (optional feature).</p>
                    <Link to="/admin/users" className="admin-btn">
                        View Users
                    </Link>
                </div>

            </div>

        </div>
    );
}
