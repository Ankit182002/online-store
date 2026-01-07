import React, { useEffect, useState } from 'react'
import api from '../api/api'
import ProductCard from '../components/ProductCard'

export default function Shop() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            <h1>Shop</h1>
            {loading ? <p>Loading...</p> : (
                <div className="grid">
                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
            )}
        </div>
    )
}