const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

// For local testing without S3 keys, we might fallback to diskStorage
// But sticking to the S3 plan. If env vars missing, it will fail or need handling.
// I'll add a check.

const storage = process.env.AWS_ACCESS_KEY_ID ? multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET,
  acl: 'public-read',
  key: function (req, file, cb) {
    cb(null, `reports/${Date.now().toString()}-${file.originalname}`)
  }
}) : multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

module.exports = { upload, s3 };
