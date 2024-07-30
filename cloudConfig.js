const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOULD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'TrekToDo_ListingImages',
        format: async (req, file) => {
            const allowedFormats = ["png", "jpg", "jpeg"];
            const format = file.mimetype.split('/')[1];
            if (allowedFormats.includes(format)) {
                return format;
            } else {
                throw new Error('Invalid format Only png,jpg,jpeg');
            }
        }
    }
});

  module.exports = {
    cloudinary,
    storage
  }