import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";   // ← IMPORTANT

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/products?limit=4")
            .then(res => setFeatured(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="home-container">

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Premium Anime & Pop Collectibles</h1>
                    <p>Exclusive Gojo Pops, Marvel heroes, DC legends & more!</p>
                    <Link to="/shop" className="hero-btn">Shop Now</Link>
                </div>
            </section>

            {/* FEATURED SECTION */}
            <section className="section">
                <h2 className="section-title">⭐ Featured Products</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="product-grid">
                        {featured.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                )}

                <div className="center">
                    <Link to="/shop" className="view-all">View all products →</Link>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="section">
                <h2 className="section-title">🔥 Products Available</h2>

                <div className="category-grid">
                    {[
                        { name: "Anime", img:'https://static.vecteezy.com/system/resources/previews/029/167/296/original/goku-gi-logo-dragonball-free-vector.jpg' },
                        { name: "Marvel", img: "https://tse4.mm.bing.net/th/id/OIP.iXkhhpFBbXKB3woupHU1aQHaDW?rs=1&pid=ImgDetMain&o=7&rm=3" },
                        { name: "DC Comics", img: "https://logos-world.net/wp-content/uploads/2020/08/DC-Symbol.png" },
                        { name: "Pokémon", img: "https://tse1.mm.bing.net/th/id/OIP.FKzF2zjYmn9Xx9BaUMj_VgHaHa?w=1200&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3" }
                    ].map(cat => (
                        <div className="category-card" key={cat.name}>
                            <img src={cat.img} alt={cat.name} />
                            <h3>{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* ABOUT US */}
            <section className="about-section">
                <h2>About Gojo Store</h2>
                <p>
                    We provide high-quality collectible vinyl figures from Anime,
                    Marvel, DC, and much more. Only premium, original products.
                </p>

                <div className="about-grid">
                    <div className="about-box">⭐ Premium Quality</div>
                    <div className="about-box">🚚 Fast Shipping</div>
                    <div className="about-box">💎 Exclusive Pops</div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>© {new Date().getFullYear()} Gojo Store. All rights reserved.</p>
            </footer>
        </div>
    );
}
