// @ts-nocheck
import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { registerTypeLoader } from "../node/typeRegister";
import { WalletLoader } from "./WalletLoader";

export const WalletType = new GraphQLObjectType({
  name: "Wallet",
  description: "wallet from user",
  fields: () => ({
    id: globalIdField("Wallet"),
    balance: {
      type: GraphQLFloat
    },
    userId: {
      type: GraphQLString
    },
    cpfCnpj: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
    deletedAt: {
      type: GraphQLString
    }
  })
})

export const WalletConnection = connectionDefinitions({
  name: "Wallet",
  nodeType: WalletType
})

registerTypeLoader(WalletType, WalletLoader.getLoader)
