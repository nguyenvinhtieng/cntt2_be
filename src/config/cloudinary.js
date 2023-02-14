const cloudinary = require("cloudinary");
const { cloudinary_config } = require("../credentials");
cloudinary.config({
    cloud_name: cloudinary_config.CLOUD_NAME,
    api_key: cloudinary_config.API_KEY,
    api_secret: cloudinary_config.API_SECRET
});
module.exports = cloudinary