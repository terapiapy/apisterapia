// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (req.baseUrl.includes('/usuarios')) {
        return 'usuarios';
      } else if (req.baseUrl.includes('/terapias')) {
        return 'terapias';
      } else if (req.baseUrl.includes('/especialistas')) {
        return 'especialistas';
      } else {
        return 'otros';
      }
    },
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

module.exports = {
  cloudinary,
  storage,
};
