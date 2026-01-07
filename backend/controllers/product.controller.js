const Product = require('../models/Product');

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {
        const { title, category, price, stock, image, description } = req.body;

        const product = await Product.create({
            title,
            category,
            price,
            stock,
            image,
            description
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const { title, category, price, stock, image, description } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { title, category, price, stock, image, description },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LIST PRODUCTS WITH SEARCH + PAGINATION
exports.listProducts = async (req, res) => {
    try {
        const q = req.query.q || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const filter = q
            ? { title: { $regex: q, $options: "i" } }
            : {};

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(products);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
