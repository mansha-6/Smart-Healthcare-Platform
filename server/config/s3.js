const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Check if Cloudinary keys are present
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

let storage;

if (false && isCloudinaryConfigured) { // Forced Local Storage for reliability during debugging
    // Configure Cloudinary with env variables
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            // Determine resource type based on mimetype to avoid "Invalid image" errors for docs
            let resourceType = 'auto';
            if (file.mimetype.match(/text|pdf|msword|office/)) {
                resourceType = 'raw';
            }

            return {
                folder: 'smart_healthcare',
                resource_type: resourceType,
                public_id: file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now(),
            };
        },
    });
    console.log('Using Cloudinary Storage');
} else {
    // Fallback to Local Disk Storage
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads'); // Absolute path

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadsDir);
        },
        filename: function (req, file, cb) {
            // Sanitize filename for disk storage as well
            const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            cb(null, Date.now() + '-' + cleanName);
        },
    });
    console.log('Using Local Disk Storage (Cloudinary keys missing) at:', uploadsDir);
}

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
