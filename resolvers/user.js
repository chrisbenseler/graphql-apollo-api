const { users, tasks }  = require('../constants')

module.exports = {
    Query: {
        users: () => users,
        user: (_, args) => users.find(user => user.id === args.id),
    },
    User: {
        tasks: ({ id }) => tasks.filter(task => task.userId === id)
    }
}