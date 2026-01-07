import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import { AuthContext } from '../context/AuthContext'

export default function Product() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [qty, setQty] = useState(1)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(console.error)
    }, [id])

    const addToCart = () => {
        api.post('/cart', { productId: id, quantity: qty })
            .then(() => alert('Added to cart'))
            .catch(() => alert('Please login to add to cart'))
    }

    if (!product) return <p>Loading...</p>
    return (
        <div>
            <h1>{product.title}</h1>
            <div style={{ display: 'flex', gap: 20 }}>
                <img src={product.image || '/placeholder.png'} alt={product.title} style={{ width: 300, height: 300, objectFit: 'contain' }} />
                <div>
                    <p>{product.description}</p>
                    <p>Price: ₹{product.price}</p>
                    <div style={{ marginTop: 8 }}>
                        <input className="input" type="number" min={1} value={qty} onChange={e => setQty(+e.target.value)} style={{ width: 100 }} />
                        <button className="button" onClick={addToCart} style={{ marginLeft: 8 }}>Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}