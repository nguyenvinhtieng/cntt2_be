const cloudinary = require('../config/cloudinary')
async function uploadImage(file) {
    let result = await cloudinary.uploader.upload(file.path,  {folder: 'cntt2'});
    console.log("Upload thanh cong file: " + file.originalFilename)
    return result
}

module.exports = uploadImage;
