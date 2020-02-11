const uuid = require('uuid')
const { users, tasks }  = require('../constants')

const { combineResolvers } = require('graphql-resolvers')

const User = require('../database/models/user')
const Task = require('../database/models/task')
const { isAuthenticated } = require('./middlewares')


module.exports = {
    Query: {
        tasks: () => tasks,
        task: (_, args) => tasks.find(task => task.id === args.id),
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
        })
    },
    Task: {
        user: ({ userId }) => users.find(user => user.id === userId)
    }
}