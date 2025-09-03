const { ApolloServer, gql } = require('apollo-server-express');
const { sequelize } = require('./config/database');
const { initUser } = require('./models/user');
const { initRoom } = require('./models/room');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const http = require('http');
const { setupWebRTC } = require('./services/webrtc');

const app = express();
const server = http.createServer(app);

initUser(sequelize);
initRoom(sequelize);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced!');
});

const typeDefs = gql`
  type Room {
    id: ID
    code: String
    createdBy: ID
  }

  type Query {
    hello: String
  }

  type Mutation {
    createRoom: Room
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World!',
  },
  Mutation: {
    createRoom: async () => {
      const user = await sequelize.models.User.findOne();
      const roomCode = uuidv4().split('-')[0];
      const room = await sequelize.models.Room.create({ code: roomCode, createdBy: user.id });
      return room;
    },
  },
};

// Setup WebRTC signaling
setupWebRTC(server);

// Add a simple root route
app.get('/', (req: any, res: any) => {
  res.send(`
    <h1>PeerShare Backend Server</h1>
    <p>Server is running successfully!</p>
    <p><a href="/graphql">Go to GraphQL Playground</a></p>
    <p>GraphQL endpoint: <code>POST /graphql</code></p>
  `);
});

// Start Apollo Server first
const apolloServer = new ApolloServer({ 
  typeDefs, 
  resolvers,
  introspection: true,
  playground: true
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql' });
  
  // Start the HTTP server (which includes Socket.IO)
  server.listen(4000, () => {
    console.log('Server started on http://localhost:4000');
    console.log('GraphQL Playground: http://localhost:4000/graphql');
    console.log('Socket.IO server ready');
  });
}).catch((error: any) => {
  console.error('Error starting Apollo Server:', error);
});