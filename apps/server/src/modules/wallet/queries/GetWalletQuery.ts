import { GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions } from "graphql-relay"
import { authMiddleware } from "../../../@shared/authMiddleware";
import { getWalletFromUserUseCase } from "../usecases/getWalletFromUser";
import { IWallet, WalletModel } from "../WalletModel";
import { createLoader } from '@entria/graphql-mongo-helpers';


export const GetWalletObjType = new GraphQLObjectType({
  name: "GetWalletResponse",
  description: "Get Wallet response",
  fields: () => ({
    userId: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLString,
    },
    cpfCnpj: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});

// Connection
export const { connectionType: WalletConnection } = connectionDefinitions({
  nodeType: GetWalletObjType,
});

export const getWalletResolverQuery = (_, args) => {
  console.log(args)
}



export const getWalletQueries = () => ({
  getWalletFromUser: {
    type: WalletConnection,
    resolve: async (_: any, args: any, ctx: any, info: any) => {
      const authorization = ctx.headers.authorization;

      const payload = await authMiddleware(authorization, [])

      const result = await getWalletFromUserUseCase(payload)

      console.log(result)

      return {
        pageInfo: {
          endCursor: 1
        },
        edges: [{ node: result }]
      }
    }
  }
})