const { skip } = require('graphql-resolvers')

module.exports.isAuthenticated = async (_, __, { email }) => {
    if(!email) {
        throw new Error('Access denied! Please log in to continue')
    }
    return skip;
}