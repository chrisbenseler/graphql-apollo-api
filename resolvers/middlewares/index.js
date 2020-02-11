const { skip } = require('graphql-resolvers')
const Task = require('../../database/models/task')
const { isValidObjectId } = require('../../database/util')

module.exports.isAuthenticated = async (_, __, { email }) => {
    if(!email) {
        throw new Error('Access denied! Please log in to continue')
    }
    return skip;
}

module.exports.isTaskOwner = async(_, { id }, { loggedInUserId}) => {
    if(!isValidObjectId(id)) {
        throw new Error('Not a valid id')
    }
    try {
        const task = await Task.findById(id)
        if(!task) {
            throw new Error('Task not found')
        } else if( task.user.toString() !== loggedInUserId ) {
            throw new Error('Not authorized')
        }
        return skip
    } catch(e) {
        console.error(e)
        throw e
    }
}