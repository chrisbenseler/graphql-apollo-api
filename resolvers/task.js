const uuid = require('uuid')

const { combineResolvers } = require('graphql-resolvers')

const User = require('../database/models/user')
const Task = require('../database/models/task')
const { isAuthenticated, isTaskOwner } = require('./middlewares')

module.exports = {
    Query: {
        tasks: combineResolvers(isAuthenticated, async (_, __, { loggedInUserId }) => {
            try {
                const tasks = await Task.find({ user: loggedInUserId })
                return tasks
            } catch(e) {
                console.error(e)
                throw e
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
            
            try {
                const task = await Task.findById(id)
                return task
            } catch(e) {
                console.error(e)
                throw e
            }
        })
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated,  async (_, { input }, { email }) => {
            try {
                const user = await User.findOne({ email })
                const task = new Task({ ...input, user })
                const result = await task.save()
                user.tasks.push(result.id)
                await user.save()
                return result
            } catch(e) {
                console.error(e)
                throw new Error(e)
            }
        }),
        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id,  input }) => {
            try {
                const task = await Task.findByIdAndUpdate(id, { ...input },  { new: true })
                return task
            } catch(e) {
                console.error(e)
                throw new Error(e)
            }
        }),
    },
    Task: {
        user: async (parent) => {
            try {
                const user = await User.findById(parent.user)
                return user
            } catch(e) {
                console.error(e)
                throw e
            }
        }
    }
}