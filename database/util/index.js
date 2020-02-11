const mongoose = require('mongoose')

module.exports.connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect to MongoDB success')
    } catch(e) {
        throw(e)
    }
}

module.exports.isValidObjectId = id => mongoose.Types.ObjectId.isValid(id)