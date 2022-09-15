const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(con => console.log(`database connected ${con.connection.host}`))
        .catch(err => console.log(err))
}
module.exports = {connectDatabase};


