const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Check if Cloudinary keys are present
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
    // Configure Cloudinary with env variables
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'smart_healthcare',
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
            resource_type: 'auto',
        },
    });
    console.log('Using Cloudinary Storage');
} else {
    // Fallback to Local Disk Storage
    const fs = require('fs');
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    });
    console.log('Using Local Disk Storage (Cloudinary keys missing)');
}

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
