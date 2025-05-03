import { connectionArgs, connectionFromArray } from "graphql-relay";
import { authMiddleware } from "../../@shared/authMiddleware";
import { TransactionModel } from "./TransactionModel";
import { TransactionConnection } from "./TransactionType";

export const transactionConnectField = () => ({
  getAllTransactionsAsSuper: {
    type: TransactionConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: async (_, args, context) => {
      const authorization = context["headers"]["authorization"]
      // await authMiddleware(authorization, ["ADMIN", "ROOT"])

      const allTransactions = await TransactionModel.find().lean();

      const transactionWithIDAsString = allTransactions.map(transaction => ({
        ...transaction,
        id: transaction._id.toString()
      }))

      return connectionFromArray(transactionWithIDAsString, args);
    }
  }

})