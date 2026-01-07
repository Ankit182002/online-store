// controllers/order.controller.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "");
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const HAS_STRIPE = !!process.env.STRIPE_SECRET_KEY;

exports.createOrder = async (req, res) => {
    try {
        console.log("createOrder - user:", req.user && req.user._id);

        // get cart and populate
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        console.log("createOrder - cart (raw):", JSON.stringify(cart, null, 2));

        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart empty' });
        }

        // Filter out broken items (where product is null)
        const validItems = cart.items.filter(i => i.product && i.product._id);
        if (validItems.length !== cart.items.length) {
            console.warn("createOrder - removed invalid cart items:", cart.items.length - validItems.length);
        }

        if (validItems.length === 0) {
            return res.status(400).json({ message: 'Cart items invalid or products removed. Please refresh your cart.' });
        }

        // Build items array and validate prices
        const items = [];
        for (const i of validItems) {
            const product = i.product;
            const price = Number(product.price);
            if (!Number.isFinite(price)) {
                console.error("createOrder - invalid price for product:", product._id, product.title, product.price);
                return res.status(400).json({ message: `Invalid price for product ${product.title}. Contact support.` });
            }

            items.push({
                product: product._id,
                title: product.title,
                price,
                quantity: Number(i.quantity) || 1
            });
        }

        const total = items.reduce((s, it) => s + (it.price * it.quantity), 0);
        console.log("createOrder - items:", items);
        console.log("createOrder - total:", total);

        // If Stripe key missing, allow a dev-friendly fallback: create a paid order immediately
        if (!HAS_STRIPE) {
            console.warn("createOrder - STRIPE_SECRET_KEY not set. Creating order in 'paid' state for local/dev.");
            const order = await Order.create({
                user: req.user._id,
                items,
                total,
                paymentIntentId: `dev_pi_${Date.now()}`,
                status: 'paid'
            });

            // reduce stock and clear cart just like confirm flow
            for (const it of order.items) {
                await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
            }
            await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

            return res.json({ clientSecret: null, orderId: order._id, devMode: true });
        }

        // Create stripe payment intent
        let paymentIntent;
        try {
            paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100), // smallest currency unit
                currency: 'usd',
                metadata: { userId: req.user._id.toString() }
            });
        } catch (stripeErr) {
            console.error("createOrder - Stripe error:", stripeErr);
            // surface stripe error message (but avoid leaking sensitive data)
            return res.status(502).json({ message: "Payment provider error. Try again later." });
        }

        // create provisional order with status 'pending'
        const order = await Order.create({
            user: req.user._id,
            items,
            total,
            paymentIntentId: paymentIntent.id,
            status: 'pending'
        });

        return res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
    } catch (err) {
        console.error("createOrder - unexpected error:", err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { orderId, paymentIntentId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.paymentIntentId !== paymentIntentId) {
            return res.status(400).json({ message: 'Payment mismatch' });
        }

        order.status = 'paid';
        await order.save();

        // reduce product stock
        for (const it of order.items) {
            await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
        }

        // clear user's cart
        await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

        res.json({ ok: true, order });
    } catch (err) {
        console.error("confirmPayment - error:", err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.getOrdersForUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Allow only owner or admin to delete
        if (
            order.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order removed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
