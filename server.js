const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const dotEnv = require('dotenv')

const { tasks, users } = require('./constants')

dotEnv.config()

const app = express()

app.use(express.json())
app.use(cors())

const typeDefs = gql`
    type Query {
        greetings: [String!]
        tasks: [Task!]
        task(id: ID!): Task
    }

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }

    type Task {
        id: ID!
        name: String!
        completed: Boolean!,
        user: User!
    }
`

const resolvers = {
    Query: {
        greetings: () => ['Hello', 'World'],
        tasks: () => tasks,
        task: (_, args) => tasks.find(task => task.id === args.id) 
    },
    Task: {
        user: ({ userId}) => users.find(user => user.id === userId)
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})

apolloServer.applyMiddleware({ app, path: '/graphql'})

const PORT = process.env.PORT || 3000

app.use('/', (req, res) => {
    res.json({ status: 'OK' })
} )

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
    console.log(`Grahql endpoint listening on ${apolloServer.graphqlPath}`)
})
