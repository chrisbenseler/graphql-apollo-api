const jwt = require('jsonwebtoken')

module.exports.verifyUser = async (req) => {
    req.email = null
    try {
        const beraerHeader = req.headers.authorization

        if(beraerHeader) {
            const token = beraerHeader.split(' ')[1]
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey')
            req.email = payload.email
        }
        
    } catch(e) {
        console.error(e)
        throw e
    }
}