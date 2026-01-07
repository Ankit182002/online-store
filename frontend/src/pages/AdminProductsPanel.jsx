import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminProductsPanel() {
    const [products, setProducts] = useState([]);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await api.get(`/products`, {
                params: { q }
            });
            setProducts(res.data || []);
        } catch (err) {
            alert("Failed to load products");
        } finally {
            setLoading(false);
        }
    }


    const openAdd = () => {
        setEditProduct(null);
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditProduct(p);
        setShowModal(true);
    };

    const deleteProduct = async (id) => {
        if (!confirm("Delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((x) => x._id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Product Management</h1>

                <div style={styles.searchRow}>
                    <input
                        placeholder="Search..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={styles.input}
                    />
                    <button style={styles.searchBtn} onClick={fetchProducts}>
                        Search
                    </button>
                    <button style={styles.addBtn} onClick={openAdd}>
                        Add Product
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={styles.grid}>
                    {products.map((p) => (
                        <div key={p._id} style={styles.card}>
                            <img
                                src={p.image || "/placeholder.png"}
                                style={styles.image}
                                alt={p.title}
                            />

                            <h3 style={styles.cardTitle}>{p.title}</h3>
                            <p style={styles.category}>{p.category}</p>

                            <div style={styles.priceRow}>
                                <span style={styles.price}>₹{p.price}</span>
                                <span style={styles.stock}>Stock: {p.stock}</span>
                            </div>

                            <div style={styles.actions}>
                                <button
                                    style={styles.editBtn}
                                    onClick={() => openEdit(p)}
                                >
                                    Edit
                                </button>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => deleteProduct(p._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <ProductModal
                    initial={editProduct}
                    onClose={() => {
                        setShowModal(false);
                        fetchProducts();
                    }}
                />
            )}
        </div>
    );
}

/* ----------------------------------------------------
   PRODUCT MODAL (ADD / EDIT)
---------------------------------------------------- */
function ProductModal({ initial, onClose }) {
    const [form, setForm] = useState({
        title: initial?.title || "",
        category: initial?.category || "",
        price: initial?.price || 0,
        stock: initial?.stock || 0,
        image: initial?.image || "",
        description: initial?.description || ""
    });

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function uploadImage(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("image", file);

        setUploading(true);

        try {
            const res = await api.post("/upload/image", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setForm((prev) => ({ ...prev, image: res.data.url }));
        } catch (err) {
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        try {
            if (initial?._id) {
                await api.put(`/products/${initial._id}`, form);
            } else {
                await api.post(`/products`, form);
            }
            onClose();
        } catch (err) {
            alert("Failed to save product");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
                <h2 style={{ marginBottom: "10px" }}>
                    {initial ? "Edit Product" : "Add Product"}
                </h2>

                <form onSubmit={handleSubmit} style={styles.modalGrid}>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label>Title</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <label>Category</label>
                        <input
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <label>Image URL</label>
                        <input
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            style={styles.input}
                        />

                        <label>Upload Image</label>
                        <input type="file" onChange={uploadImage} />
                        {uploading && <p>Uploading...</p>}
                    </div>

                    <div>
                        <label>Preview</label>
                        <div style={styles.previewBox}>
                            {form.image ? (
                                <img src={form.image} style={{ maxHeight: "100%" }} />
                            ) : (
                                <span>No Image</span>
                            )}
                        </div>

                        <label>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.modalButtons}>
                        <button style={styles.saveBtn}>
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ----------------------------------------------------
   STYLES
---------------------------------------------------- */
const styles = {
    page: { padding: "20px" },
    header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
    title: { fontSize: "28px", fontWeight: "700", color: "#4b0082" },
    searchRow: { display: "flex", gap: "10px" },
    input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
    searchBtn: { padding: "10px 16px", background: "#6a5acd", color: "#fff", borderRadius: "8px" },
    addBtn: { padding: "10px 16px", background: "#28a745", color: "#fff", borderRadius: "8px" },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px",
    },

    card: {
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    image: {
        width: "100%",
        height: "180px",
        objectFit: "contain",
        borderRadius: "8px",
    },

    cardTitle: { fontSize: "18px", fontWeight: "600" },
    category: { fontSize: "13px", color: "#555" },

    priceRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    price: { fontSize: "20px", fontWeight: "700", color: "#d32f2f" },
    stock: { fontSize: "12px", color: "#555" },

    actions: { display: "flex", gap: "10px" },
    editBtn: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        background: "#1976d2",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
    deleteBtn: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        background: "#d32f2f",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },

    /* Modal */
    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    modalBox: {
        background: "#fff",
        padding: "20px",
        width: "600px",
        borderRadius: "12px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.15)"
    },

    modalGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
    },

    previewBox: {
        height: "200px",
        background: "#f4f4f4",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    textarea: {
        width: "100%",
        height: "120px",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },

    modalButtons: {
        gridColumn: "span 2",
        display: "flex",
        gap: "10px",
        marginTop: "20px"
    },

    saveBtn: {
        flex: 1,
        padding: "12px",
        background: "#28a745",
        color: "#fff",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer"
    },

    cancelBtn: {
        flex: 1,
        padding: "12px",
        borderRadius: "8px",
        background: "#ccc",
        cursor: "pointer",
        border: "none"
    }
};
