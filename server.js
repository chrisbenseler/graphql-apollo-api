const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const dotEnv = require('dotenv')

const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
const { connection } = require('./database/util')

dotEnv.config()

const app = express()

connection()

app.use(express.json())
app.use(cors())


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
