import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/orders/me")
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => console.error("Error loading orders:", err));
    }, []);

    // ✅ Remove order handler
    const removeOrder = async (id) => {
        if (!window.confirm("Are you sure you want to remove this order?")) return;

        try {
            await api.delete(`/orders/${id}`);
            setOrders(prev => prev.filter(o => o._id !== id));
        } catch (err) {
            console.error("Failed to remove order:", err);
            alert("Failed to remove order");
        }
    };

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading Orders...</h2>;

    return (
        <div className="orders-container">

            {/* Inline CSS */}
            <style>{`
                body {
                    background: #f4f4f8;
                }

                .orders-container {
                    padding: 30px;
                    animation: fadeIn .5s ease-in-out;
                }

                .orders-title {
                    font-size: 2rem;
                    text-align: center;
                    font-weight: 700;
                    color: #4b0082;
                }

                .orders-list {
                    margin-top: 25px;
                    display: grid;
                    gap: 20px;
                }

                .order-card {
                    background: #fff;
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid #e0d4ff;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transition: .3s ease;
                }

                .order-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 18px rgba(75, 0, 130, 0.18);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }

                .order-id {
                    font-weight: 600;
                    color: #4b0082;
                }

                .order-status {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: .85rem;
                }

                .status-processing { background: #fff1a6; color: #7a5f00; }
                .status-delivered { background: #d2ffd2; color: #107a10; }
                .status-cancelled { background: #ffd2d2; color: #8a0000; }

                .order-items {
                    padding-left: 15px;
                    margin-bottom: 10px;
                }

                .order-item {
                    margin-bottom: 6px;
                    color: #444;
                }

                .order-total {
                    margin-top: 10px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #4b0082;
                }

                .order-actions {
                    margin-top: 12px;
                    text-align: right;
                }

                .remove-btn {
                    padding: 8px 14px;
                    border-radius: 8px;
                    border: none;
                    background: #ff4d4d;
                    color: #fff;
                    cursor: pointer;
                    font-weight: 600;
                    box-shadow: 0 3px 8px rgba(255,77,77,0.3);
                    transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
                }

                .remove-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 5px 12px rgba(255,77,77,0.4);
                    opacity: 0.95;
                }

                .back-btn {
                    margin-top: 25px;
                    display: inline-block;
                    padding: 10px 16px;
                    background: linear-gradient(135deg,#7a4bff,#4b0082);
                    color:white;
                    border-radius:10px;
                    text-decoration:none;
                    font-weight:600;
                    box-shadow:0 4px 10px rgba(75,0,130,.2);
                }

                @keyframes fadeIn {
                    from { opacity:0; transform: translateY(10px); }
                    to { opacity:1; transform: translateY(0px); }
                }
            `}</style>

            {/* Title */}
            <h1 className="orders-title">🛒 My Orders</h1>

            {/* No orders */}
            {orders.length === 0 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <p>No orders found.</p>
                    <Link to="/shop" className="back-btn">Shop Now</Link>
                </div>
            )}

            {/* Orders */}
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order._id} className="order-card">
                        
                        {/* Order Header */}
                        <div className="order-header">
                            <span className="order-id">Order #{order._id.slice(-6)}</span>

                            <span className={`order-status status-${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Order Items */}
                        <div className="order-items">
                            {order.items.map(item => (
                                <div key={item._id} className="order-item">
                                    {item.product?.title} × {item.quantity}
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="order-total">
                            Total: ₹{order.total}
                        </div>

                        {/* Remove button */}
                        <div className="order-actions">
                            <button
                                className="remove-btn"
                                onClick={() => removeOrder(order._id)}
                            >
                                ❌ Remove Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: "center" }}>
                <Link to="/dashboard" className="back-btn">
                    Back to Dashboard
                </Link>
            </div>

        </div>
    );
}
