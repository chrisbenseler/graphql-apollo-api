const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const dotEnv = require('dotenv')
const Dataloader = require('dataloader')

const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
const { connection } = require('./database/util')
const { verifyUser } = require('./helper/context')
const loaders = require('./loaders')

dotEnv.config()

const app = express()

connection()

app.use(express.json())
app.use(cors())


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        await verifyUser(req)
        return {
            email: req.email,
            loggedInUserId: req.loggedInUserId,
            loaders: {
                user: new Dataloader(keys => loaders.user.batchUsers(keys))
            }
        }
    }
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
