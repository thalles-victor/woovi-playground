import { create } from "domain";
import { GraphQLInputObjectType, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { authMiddleware } from "../../../@shared/authMiddleware";
import { createTransactionUseCase } from "../usecases/createTrasactionUsecase"
import { WalletType } from "../../wallet/WalletType"

const CreateTransactionInputType = new GraphQLInputObjectType({
  name: "createTransactionInputType",
  description: "Input type for creating a transaction",
  fields: () => ({
    toCpfCnpj: {
      type: GraphQLString,
      description: "The amount of the transaction"
    },
    value: {
      type: GraphQLInt,
      description: "The description of the transaction"
    }
  })
});

const CreateTransactionResponseObjType = new GraphQLObjectType({
  name: "createTransactionResponse",
  description: "Create transaction response",
  fields: () => ({
    transaction: {
      type: new GraphQLObjectType({
        name: "transactionCreateResponse",
        fields: () => ({
          id: {
            type: GraphQLString,
            description: "The id of the transaction"
          },
          fromCpfCnpj: {
            type: GraphQLString,
            description: "the from cpf or cnpj of the transaction"
          },
          toCpfCnpj: {
            type: GraphQLString,
            description: "the to cpf or cnpj of the transaction"
          },
          value: {
            type: GraphQLInt,
            description: "The description of the transaction"
          },
          createdAt: {
            type: GraphQLString,
            description: "The description of the transaction"
          },
        })
      })
    },
    wallet: {
      type: WalletType
    }
  })
});

export const createTransactionResolverMutation = mutationWithClientMutationId({
  name: "createTransaction",
  description: "Create a transaction",
  inputFields: {
    transactionDto: {
      type: CreateTransactionInputType
    }
  },
  outputFields: { data: { type: CreateTransactionResponseObjType } },
  mutateAndGetPayload: async (args, context) => {
    const authorization = context["headers"]["authorization"];

    const payload = await authMiddleware(authorization, []);


    const result = await createTransactionUseCase(payload, args.transactionDto)

    return { data: result };
  }
});