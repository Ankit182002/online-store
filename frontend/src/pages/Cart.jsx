import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
    const [cart, setCart] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/cart')
            .then(res => setCart(res.data))
            .catch(() => setCart({ items: [] }))
    }, [])

    // ✅ FIXED — Update quantity (backend expects POST /cart/add)
    const updateQty = (productId, qty) => {
        api.post("/cart/add", { productId, quantity: qty })
            .then(res => setCart(res.data))
            .catch(console.error)
    }

    // ✅ FIXED — Remove item (backend expects POST /cart/remove)
    const removeItem = (productId) => {
        api.post("/cart/remove", { productId })
            .then(res => setCart(res.data))
            .catch(console.error)
    }

    const checkout = () => {
        navigate('/checkout')
    }

    if (!cart) return <p style={styles.loading}>Loading...</p>

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Your Cart</h1>

            {cart.items.length === 0 ? (
                <p style={styles.empty}>
                    Your cart is empty. <Link to="/shop" style={styles.link}>Shop now</Link>
                </p>
            ) : (
                <div style={styles.cartList}>
                    {cart.items.map(it => (
                        <div key={it._id} style={styles.cartItem}>
                            <img
                                src={it.product.image || '/placeholder.png'}
                                alt={it.product.title}
                                style={styles.image}
                            />

                            <div style={styles.info}>
                                <h4 style={styles.productTitle}>{it.product.title}</h4>
                                <p style={styles.price}>₹{it.product.price}</p>
                            </div>

                            <div style={styles.actions}>
                                {/* quantity input */}
                                <input
                                    type="number"
                                    min={1}
                                    value={it.quantity}
                                    onChange={(e) =>
                                        updateQty(it.product._id, Number(e.target.value))
                                    }
                                    style={styles.qtyInput}
                                />

                                {/* remove button */}
                                <button
                                    style={styles.removeBtn}
                                    onClick={() => removeItem(it.product._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div style={styles.checkoutContainer}>
                        <button style={styles.checkoutBtn} onClick={checkout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#4b0082'
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#555'
    },
    empty: {
        fontSize: '16px',
        color: '#555'
    },
    link: {
        color: '#916aff',
        fontWeight: '600',
        textDecoration: 'underline'
    },
    cartList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
        background: '#fff'
    },
    image: {
        width: '100px',
        height: '100px',
        objectFit: 'contain',
        borderRadius: '8px'
    },
    info: {
        flex: 1
    },
    productTitle: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
    },
    price: {
        margin: '6px 0 0',
        fontSize: '16px',
        color: '#555'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    qtyInput: {
        width: '70px',
        padding: '6px 10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    removeBtn: {
        padding: '6px 12px',
        border: 'none',
        borderRadius: '8px',
        background: '#ff4d4d',
        color: '#fff',
        cursor: 'pointer'
    },
    checkoutContainer: {
        marginTop: '20px',
        textAlign: 'right'
    },
    checkoutBtn: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #916aff, #5a0db2)',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 6px 14px rgba(75, 0, 130, 0.25)'
    }
}
