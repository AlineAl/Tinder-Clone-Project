"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const { ApolloServer, gql } = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const client_1 = __importDefault(require("./prisma/client"));
const express = require("express");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    const httpServer = (0, http_1.createServer)(app);
    const typeDefs = gql `
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
                return client_1.default.user.findMany();
            },
            messages: () => {
                return client_1.default.message.findMany();
            },
        },
    };
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: "bounded",
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)()],
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        path: "/api",
    });
    httpServer.listen({ port: process.env.PORT || 4000 }, () => console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`));
});
startServer();
