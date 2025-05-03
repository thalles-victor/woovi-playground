import { connectionArgs, connectionFromArray } from "graphql-relay";
import { WalletLoader } from "./WalletLoader";
import { WalletConnection, WalletType } from "./WalletType";
import { WalletModel } from "./WalletModel";
import { authMiddleware } from "../../@shared/authMiddleware";

export const walletConnectionField = () => ({
  getWalletFromUser: {
    type: WalletType,
    args: {
      ...connectionArgs
    },
    resolve: async (_, args, context) => {
      const { headers, ...rest } = context;
      const authorization = headers["authorization"]
      const payload = await authMiddleware(authorization, [])

      const filter = {
        ...(args.filter || {}),
        balance: 10, // força balance
      };

      const allWallets = await WalletModel.find({ userId: payload.sub }).lean(); // ou .exec()

      console.log(allWallets)
      const [walletIdToString] = allWallets.map(wallet => ({
        ...wallet,
        id: wallet._id.toString()
      }))
      // Usa o helper para paginar conforme os args do Relay
      return walletIdToString;
    }
  },
  getAllWalletAsSuper: {
    type: WalletConnection.connectionType,
    args: {
      ...connectionArgs
    },
    resolve: async (_, args, context) => {
      const authorization = context["headers"]["authorization"]
      await authMiddleware(authorization, ["ADMIN", "ROOT"])

      const allWallets = await WalletModel.find().lean();


      const walletWithIDAsString = allWallets.map(wallet => ({
        ...wallet,
        id: wallet._id.toString()
      }))

      return connectionFromArray(walletWithIDAsString, args);
    }
  }
})