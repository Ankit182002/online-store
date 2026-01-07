const router = require('express').Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const userCtrl = require('../controllers/user.controller');
const User = require('../models/User');

// USER — Profile routes
router.get('/profile', auth, userCtrl.getProfile);
router.put('/profile', auth, userCtrl.updateProfile);

// ADMIN — Get all users
router.get('/all', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load users" });
    }
});

// ADMIN — Update role
router.put('/role/:id', auth, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { role });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update role" });
    }
});

// ADMIN — Delete user
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

module.exports = router;
