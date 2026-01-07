import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data || { items: [] });
    } catch (err) {
      console.error("Failed fetching cart:", err);
      setCart({ items: [] });
    }
  };

  const placeOrder = async () => {
    setErrorMsg("");
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      setErrorMsg("Cart is empty. Add some items before placing order.");
      return;
    }

    // Validate cart items locally before creating order
    for (const it of cart.items) {
      if (!it.product) {
        setErrorMsg("One of the cart items is missing product details. Please refresh and try again.");
        return;
      }
      if (typeof it.product.price !== "number") {
        setErrorMsg("One of the cart items has an invalid price. Please contact support.");
        return;
      }
    }

    setLoading(true);

    try {
      // 1) create order on server (server creates Stripe PaymentIntent + provisional order)
      const createRes = await api.post("/orders/create");
      if (!createRes?.data) throw new Error("Empty response from server when creating order.");

      const { clientSecret, orderId } = createRes.data;
      if (!orderId) throw new Error("Server did not return orderId. Check backend logs.");

      console.log("Order created:", orderId, "clientSecret:", clientSecret);

      // 2) Simulate Stripe payment success (you can replace this with real Stripe flow later)
      const fakePaymentIntentId = "pi_test_" + Math.random().toString(36).substring(7);

      // 3) Confirm payment on server
      const confirmRes = await api.post("/orders/confirm", {
        orderId,
        paymentIntentId: fakePaymentIntentId,
      });

      if (!confirmRes?.data?.ok) {
        // If server returns ok:false or doesn't include ok, surface message
        const serverMsg = confirmRes?.data?.message || "Payment confirmation failed on server.";
        throw new Error(serverMsg);
      }

      // 4) Refresh cart (server should have cleared it in confirm handler)
      await fetchCart();

      // 5) Redirect to orders page
      navigate("/orders");
    } catch (err) {
      console.error("Checkout Error:", err);
      // Prefer descriptive server-side message when possible
      const serverMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Unknown error during checkout. Check server logs.";
      setErrorMsg(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const totalPrice = (cart.items || []).reduce((acc, item) => {
    const price = item?.product?.price;
    const qty = item?.quantity || 0;
    if (typeof price !== "number") return acc;
    return acc + price * qty;
  }, 0);

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ color: "#4b0082", textAlign: "center" }}>Checkout</h1>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2>Order Summary</h2>

        {errorMsg && (
          <div style={{ marginBottom: 16, color: "#8a0000", fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        {(cart.items || []).map((item) => (
          <div key={item._id} style={{ display: "flex", marginBottom: 12, alignItems: "center" }}>
            <img
              src={(item.product && item.product.image) || "/placeholder.png"}
              alt={item.product?.title || "product"}
              style={{ width: 60, height: 60, objectFit: "contain", marginRight: 12 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.product?.title || "Unknown product"}</div>
              <div style={{ color: "#555" }}>
                {item.quantity} × ₹{typeof item.product?.price === "number" ? item.product.price : "—"}
              </div>
            </div>
            <div style={{ width: 120, textAlign: "right", color: "#333", fontWeight: 600 }}>
              ₹{typeof item.product?.price === "number" ? (item.product.price * item.quantity) : "—"}
            </div>
          </div>
        ))}

        <h3 style={{ textAlign: "right", marginTop: 12 }}>Total: ₹{totalPrice}</h3>

        <button
          onClick={placeOrder}
          disabled={loading}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 14,
            borderRadius: 10,
            background: loading ? "#b79bff" : "linear-gradient(135deg, #916aff, #5a0db2)",
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 6px 14px rgba(75,0,130,0.25)",
          }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
