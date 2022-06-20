import { createServer } from "http";

const { ApolloServer, gql } = require("apollo-server-express");
const { prisma } = require("../prisma/client");
const express = require("express");

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const typeDefs = gql`
    type Query {
      users: [User]
      messages: [Message]
    }

    type User {
      id: ID!
      firstname: String!
      email: String!
      password: String!
      description: String
      day: Int!
      month: Int!
      year: Int!
      show_gender: Boolean
      Identity: String
      Interest: String
      url: String
      matches: [String]
    }

    type Message {
      id: ID!
      from_userId: String
      to_userId: String
      message: String
    }
  `;

  const resolvers = {
    Query: {
      users: () => {
        return prisma.user.findMany();
      },
      messages: () => {
        return prisma.message.findMany();
      },
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/api",
  });

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  );
};

startServer();
