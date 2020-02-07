const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { users, tasks }  = require('../constants')
const User = require('../database/models/user') 

module.exports = {
    Query: {
        users: () => users,
        user: (_, { id }, { email }) => {
            console.log(email)
            return users.find(user => user.id === id)
        },
    },
    User: {
        tasks: ({ id }) => tasks.filter(task => task.userId === id)
    },
    Mutation: {
        signUp: async (_, { input }) => {
            try {
                const user = await User.findOne({ email: input.email })
                if(user)
                    throw new Error('E-mail already in use')
                const hashedPassword = await bcrypt.hash(input.password, 10)
                const newUser = new User({ ...input, password: hashedPassword })
                const result = await newUser.save()
                return result
            } catch(e) {
                console.error(e)
                throw e
            }
        },
        login: async (_, { input}) => {
            try {
                const user = await User.findOne({ email: input.email })
                if(!user) {
                    throw new Error('User not found')
                }
                const isPassWordValid = await bcrypt.compare(input.password, user.password)
                if(!isPassWordValid) {
                    throw new Error('Invalid credentials')
                }
                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'mysecretkey', { expiresIn: '1d' })
                return { token }
            } catch(e) {
                console.error(e)
                throw e
            }
        }
    }
}