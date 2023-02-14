
const cloudinary = require('../config/cloudinary')
async function deleteImage(public_id) {
  await cloudinary.uploader.destroy(public_id);
}

module.exports = deleteImage;