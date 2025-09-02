const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Room {
    id: ID!
    code: String!
    roomId: Int!
    createdBy: Int!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    authProvider: String!
    createdAt: String!
    updatedAt: String!
  }

  type CreateRoomResponse {
    success: Boolean!
    code: String
    roomId: Int
    message: String
  }

  type Query {
    rooms: [Room!]!
    users: [User!]!
    room(code: String!): Room
  }

  type Mutation {
    createRoom: CreateRoomResponse!
  }
`;

module.exports = { typeDefs };
