import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (e) {
                console.error("Invalid token:", e);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const signin = (token) => {
        localStorage.setItem("token", token);
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (e) {
            console.error("Error decoding token:", e);
            setUser(null);
        }
    };

    const signout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
}
