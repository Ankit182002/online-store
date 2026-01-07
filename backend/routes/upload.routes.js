const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ url: result.secure_url });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Cloudinary upload failed" });
    }
});

module.exports = router;
