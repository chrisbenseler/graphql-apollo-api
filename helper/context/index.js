const jwt = require('jsonwebtoken')

const User = require('../../database/models/user')

module.exports.verifyUser = async (req) => {
    req.email = null
    req.loggedInUserId = null
    try {
        const beraerHeader = req.headers.authorization

        if(beraerHeader) {
            const token = beraerHeader.split(' ')[1]
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey')
            req.email = payload.email

            const user = await User.findOne({ email: req.email })
            req.loggedInUserId = user.id 
        }
        
    } catch(e) {
        console.error(e)
        throw e
    }
}