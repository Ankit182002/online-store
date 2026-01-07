import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const res = await api.get("/user/all");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load users");
        } finally {
            setLoading(false);
        }
    }

    async function updateRole(id, newRole) {
        try {
            await api.put(`/user/role/${id}`, { role: newRole });
            setUsers(prev =>
                prev.map(u => (u._id === id ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update role");
        }
    }

    async function deleteUser(id) {
        if (!confirm("Delete this user?")) return;
        try {
            await api.delete(`/user/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete");
        }
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <h2 className="text-center mt-10">Loading users...</h2>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin — Users</h1>

            {/* Search Box */}
            <div className="mb-4 flex gap-2">
                <input
                    className="border px-3 py-2 rounded w-64"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border">Name</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">Role</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="p-3 border">{user.name}</td>
                                <td className="p-3 border">{user.email}</td>
                                <td className="p-3 border">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateRole(user._id, e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-3 border">
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
