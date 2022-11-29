const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

const authors = [
  { id: 1, name: "Author one" },
  { id: 2, name: "Author two" },
  { id: 3, name: "Author three" },
];

const books = [
  { id: 1, name: "War of the worlds", authorID: 1 },
  { id: 2, name: "The Borrowers", authorID: 3 },
  { id: 3, name: "Attack on Titan", authorID: 2 },
  { id: 4, name: "Monster", authorID: 2 },
  { id: 5, name: "The Willowboughs", authorID: 3 },
  { id: 6, name: "Death Note", authorID: 1 },
  { id: 7, name: "Dork Diaries", authorID: 3 },
  { id: 8, name: "Archie", authorID: 2 },
  { id: 9, name: "Family Guy", authorID: 1 },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "authors book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorID: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorID);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "authors list",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorID === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "a single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return books.find((book) => book.id === args.id);
      },
    },
    author: {
      type: AuthorType,
      description: "a single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return authors.find((author) => author.id === args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "list of authors",
      resolve: () => authors,
    },
  }),
});

const RootMutatiionType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorID: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorID: args.authorID,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "add author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutatiionType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log("server up and running"));
