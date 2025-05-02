import mongoose, { Schema } from "mongoose";

interface IWallet {
  balance: number;
  userId: string;
  cpfCnpj: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const walletSchema = new mongoose.Schema<IWallet>({
  balance: { type: Schema.Types.Number, required: true },
  cpfCnpj: { type: String, required: true, unique: true, indexes: true },
  userId: { type: String, required: true, indexes: true },
  deletedAt: { type: Date, required: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const WalletModel = mongoose.model<IWallet>("Wallet", walletSchema);
