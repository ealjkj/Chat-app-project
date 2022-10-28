const { loadSchemaSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { printSchema } = require("graphql");

const typeDefs = loadSchemaSync("src/schema.graphql", {
  loaders: [new GraphQLFileLoader()],
});

module.exports = typeDefs;
