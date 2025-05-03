import mongoose, { Model, Schema, Document } from "mongoose";




export const walletSchema = new mongoose.Schema<IWallet>({
  balance: { type: Schema.Types.Number, required: true },
  cpfCnpj: { type: String, required: true, unique: true, indexes: true },
  userId: { type: String, required: true, indexes: true },
  deletedAt: { type: Date, required: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export type IWallet = {
  balance: number;
  userId: string;
  cpfCnpj: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
} & Document

export const WalletModel: Model<IWallet> = mongoose.model("Wallet", walletSchema);
