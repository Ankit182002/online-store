import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(orderId, newStatus) {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev =>
                prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    }

    if (loading) return <h2 className="text-center mt-10">Loading orders...</h2>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin — All Orders</h2>

            <div className="grid gap-6">
                {orders.map(order => (
                    <div key={order._id} className="border p-4 rounded-lg bg-white shadow-sm">

                        {/* Order Header */}
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                                <p className="text-sm text-gray-600">
                                    Customer: {order.user?.name} ({order.user?.email})
                                </p>
                                <p className="text-xs text-gray-500">
                                    Placed: {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                className="border px-3 py-2 rounded bg-gray-100"
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item._id} className="flex items-center gap-4 border p-2 rounded">
                                    <img
                                        src={item.product?.image || "/placeholder.png"}
                                        className="w-16 h-16 object-contain bg-gray-50 rounded"
                                        alt=""
                                    />
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} × ₹{item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-3 text-right font-bold text-purple-700">
                            Total: ₹{order.total}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
