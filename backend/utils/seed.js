require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const sample = [
    { title: 'Pop: Iron Man', description: 'Vinyl figure', price: 12.99, stock: 10, images: [], category: 'Marvel' },
    { title: 'Pop: Batman', description: 'Classic Batman', price: 11.99, stock: 8, images: [], category: 'DC' },
    { title: 'Pop: Pikachu', description: 'Pokemon Pikachu', price: 10.5, stock: 15, images: [], category: 'Anime' }
];

(async () => {
    try {
        await connectDB();
        await Product.deleteMany({});
        await Product.insertMany(sample);
        console.log('Seeded products');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();