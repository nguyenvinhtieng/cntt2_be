const mongoose = require('mongoose');
const credentials = require('../credentials.js')

const connectionString = credentials.mongo.connectionString
async function connect() {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect successfully')
    } catch (e) {
        console.log('Connect failure: ' + e)
    }
}

module.exports = { connect };