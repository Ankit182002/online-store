import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.webp";

export default function Navbar() {
    const { user, signout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <nav style={styles.navbar}>
            {/* Logo */}
            <div style={styles.leftSection}>
                <Link to="/" style={styles.logoLink}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <span style={styles.brandName}>ShopStore</span>
                </Link>
            </div>

            {/* Links */}
            <div style={styles.rightSection}>
                <Link style={styles.link} to="/shop">Shop</Link>
                <Link style={styles.link} to="/cart">Cart</Link>

                {user ? (
                    <>
                        <span style={styles.userText}>Hi, {user.name || 'User'}</span>
                        <Link style={styles.link} to="/dashboard">Dashboard</Link>
                        {user.role === "admin" && (
                            <Link style={styles.link} to="/admin">Admin</Link>
                        )}

                        <button
                            style={styles.button}
                            onClick={() => {
                                signout();
                                navigate("/");
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link style={styles.link} to="/login">Sign In</Link>
                        <Link style={styles.link} to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}


const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
    },
    logoLink: {
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
    },
    logo: {
        height: "40px",
        marginRight: "10px",
    },
    brandName: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#222",
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    link: {
        textDecoration: "none",
        color: "#333",
        fontSize: "16px",
        padding: "6px 10px",
        borderRadius: "6px",
    },
    button: {
        padding: "6px 14px",
        border: "none",
        background: "linear-gradient(135deg, #916aff, #5a0db2)",
        color: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 6px 14px rgba(75, 0, 130, 0.25)",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    buttonHover: {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 20px rgba(75, 0, 130, 0.35)",
    },

    userText: {
        fontSize: "15px",
        color: "#555",
        marginRight: "4px"
    }
};
