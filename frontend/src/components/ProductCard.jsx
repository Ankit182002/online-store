import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    return (
        <div className="card">
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={product.image || '/placeholder.png'} alt={product.title} style={{ width: '100%', height: 180, objectFit: 'contain' }} />
                <h3>{product.title}</h3>
                <p><small>{product.category}</small></p>
                <p>₹{product.price}</p>
            </Link>
        </div>
    )
}