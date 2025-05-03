import { GraphQLObjectType, GraphQLString } from "graphql";
import { registerTypeLoader } from "../node/typeRegister";
import { TransactionLoader } from "./TransactionLoader";
import { connectionDefinitions } from "graphql-relay";

export const TransactionType = new GraphQLObjectType({
  name: "Transaction",
  description: "transaction from user",
  fields: () => ({
    id: {
      type: GraphQLString
    },
    fromCpfCnpj: {
      type: GraphQLString
    },
    toCpfCnpj: {
      type: GraphQLString
    },
    value: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    }
  })
})

export const TransactionConnection = connectionDefinitions({
  name: "Transaction",
  nodeType: TransactionType
})

registerTypeLoader(TransactionType, TransactionLoader.getLoader)