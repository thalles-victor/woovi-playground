import mongoose from "mongoose";
import { RoleType } from "../../@shared/types";
import { ROLE } from "../../@shared/metadata";

interface IUser {
  name: string;
  email: string;
  cpfCnpj: string;
  activatedAt: Date | null;
  deletedAt: Date | null;
  password: string;
  role: RoleType;
  createdAt: Date;
  updatedAt: Date;
}

export const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, indexes: true },
  cpfCnpj: { type: String, required: true, unique: true, indexes: true },
  password: { type: String },
  deletedAt: { type: Date, required: false, default: null },
  role: { type: String, enum: ROLE, required: true, default: "USER" },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
