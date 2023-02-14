const xss = require("xss");

function checkXss(req, res, next) {
    let { ...rest } = req.body
    let keys = Object.keys(rest)
    keys.forEach(key => {
        var html = xss(rest[key]);
        req.body[key] = html
    })
    next()
}
module.exports = checkXss