const { ApolloServer } = require('apollo-server');
const {sequelize} = require('./models')



// The GraphQL schema
const typeDefs = require('./graphql/typeDef')

// A map of functions which return data for the schema.
const resolvers = require('./graphql/resolvers')

const contextMiddleWare = require('./util/contextMiddleware')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleWare
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  sequelize.authenticate()
    .then(() => console.log('database connected'))
    .catch((err) => console.log(err))
});