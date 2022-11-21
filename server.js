const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!,
    name: String!,
    email: String!,
  }
input UserInput {
    name: String!,
    email: String!
  }
type Query {
    getUser: [User!]!
  }
type Mutation {
    createUser(input: UserInput): User
    updateUser(id: ID!, input: UserInput): User
  }
`);

const id = require('crypto').randomBytes(10).toString('hex');
let users = [{ id, name: 'brachio', email: 'brachio@email.com' }];
const root = {
  getUser: () => {
    return users;
  },
  createUser: ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex');
    users.push({ id, ...input });
    return { id, ...input };
  },
  updateUser: ({ id, input }) => {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, ...input };
      } else {
        return user;
      }
    });
    users = [...newUsers];
    return { id, ...input };
  },
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(5000);
console.log('Running a GraphQL API server at http://localhost:5000/graphql');
