const bcrypt = require('bcryptjs')
const { users, tasks }  = require('../constants')
const User = require('../database/models/user') 

module.exports = {
    Query: {
        users: () => users,
        user: (_, args) => users.find(user => user.id === args.id),
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
                throw e;
            }
        }
    }
}