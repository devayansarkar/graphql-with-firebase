const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Will initialize with default settings and database
admin.initializeApp()
const db = admin.firestore()
const app = express();

const typeDefs = gql`
    type User {
        firstName: String
        lastName: String
        email: String
    }

    type Query {
        users : [User]
    }
`

const resolvers = {
    Query: {
        users: () => {
            return new Promise((resolve, reject) => {
                fetchAllUsers((data) => {
                    resolve(data);
                });
            });
        }
    }
}

const fetchAllUsers = (callback) => {
    db.collection('users')
        .get()
        .then((item) => {
            const items = [];
            item.docs.forEach(item => {
                console.log('Adding...')
                items.push(item.data())
            });
            return callback(items);
        })
        .catch(e => console.log(e));
}
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/' })

exports.graphql = functions.https.onRequest(app);
