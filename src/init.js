const bcrypt = require("bcrypt");
const User = require("./app/models/User.js");
async function createAdminAccount() {
    let acc = await User.findOne({ role: "admin" });
    if (!acc) {
        const data = {
            username: "admin",
            email: "admin@gmail.com",
            fullname: "Admin",
            role: "admin",
            is_verify: true,
            password: "123456",

        };
        const passwordHash = bcrypt.hashSync(data.password, 10);
        data.password = passwordHash;
        const account = new User(data);
        await account.save();
        console.log("Admin account was initialized");
    }
}
module.exports = { createAdminAccount };
