const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user normally
        const user = await User.findById(payload.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Invalid token user' });

        // FIX: Don't set req.user to the Mongoose document
        // Set a CLEANED object so controllers work properly
        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid', error: err.message });
    }
};
