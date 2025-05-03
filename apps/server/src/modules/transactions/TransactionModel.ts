// @ts-nocheck
import mongoose, { Document, Schema } from "mongoose";

export type ITransaction = {
  fromCpfCnpj: string;
  toCpfCnpj: string;
  value: number;
  createdAt: Date;
} & Document

export const transactionSchema = new mongoose.Schema<ITransaction>({
  fromCpfCnpj: { type: String, required: true },
  toCpfCnpj: { type: String, required: true },
  value: { type: Schema.Types.Number, required: true },
  createdAt: { type: Date, required: true },
});

export const TransactionModel = mongoose.model<ITransaction>(
  "Transactions",
  transactionSchema
);