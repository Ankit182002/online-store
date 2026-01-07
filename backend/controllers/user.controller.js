const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// UPDATE PROFILE (name, email, password only)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;

        if (password && password.trim().length > 0) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({
            message: "Profile updated",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Update failed" });
    }
};
