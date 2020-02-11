const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { combineResolvers } = require('graphql-resolvers')

const User = require('../database/models/user')
const Task = require('../database/models/task')
const { isAuthenticated } = require('./middlewares')

module.exports = {
    Query: {
        user: combineResolvers(isAuthenticated, async(_, __, { email }) => {
            try {
                const user = await User.findOne({ email })
                if(!user)
                    throw new Error('User not found')
                return user
            } catch(e) {
                console.error(e)
                throw new Error(e)
            }
        }),
    },
    User: {
        tasks: async ({ id }) => {
            try {
                const tasks = await Task.find({ user: id })
                return tasks
            } catch(e) {
                console.error(e)
                throw new Error(e)
            }
        }
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