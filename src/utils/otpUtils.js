const schedule = require("node-schedule");
const Token = require("../app/models/Token.js");

const add_minutes = function (dt, minutes) {
    return new Date(dt.getTime() + minutes * 60000);
};

function deleteToken(id, minutes = 1) {
    const date = add_minutes(new Date(), minutes);
    schedule.scheduleJob(date, async () => {
        await Token.findByIdAndRemove(id);
    });
}


module.exports = { deleteToken };
