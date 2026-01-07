const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add or update item
exports.addItem = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

        const idx = cart.items.findIndex(i => i.product.toString() === productId);
        if (idx > -1) {
            cart.items[idx].quantity = quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();
        cart = await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove item
exports.removeItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter(i => i.product.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};