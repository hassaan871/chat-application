const mongoose = require('mongoose');
const DB_NAME = require('../constants');

const dbconnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Connected to database ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`Mongodb Connection ERROR: ${error}`);
    }
}

module.exports = dbconnect;