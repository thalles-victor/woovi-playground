// @ts-nocheck
import mongoose, { mongo } from 'mongoose';
import { PayloadType } from ".././../../@shared/types"
import { WalletModel } from "../WalletModel";
import { UserModel } from '../../user/UserModel';
import { CustomErrorResponse } from '../../error/validateSchema';

export async function getWalletFromUserUseCase(payload: PayloadType) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await UserModel.findOne({ _id: payload.sub }).session(session).exec();

    if (!user) {
      throw new CustomErrorResponse({
        message: "User not found",
        statusCode: 404,
      })
    }

    if (user.deletedAt) {
      throw new CustomErrorResponse({
        message: "User deleted or not found",
        statusCode: 404,
      })
    }


    const userId = payload.sub;
    const wallet = await WalletModel.findOne({ userId: userId }).session(session).exec();

    if (!wallet) {
      throw new CustomErrorResponse({
        message: "Wallet not found",
        statusCode: 404,
      });
    }

    await session.commitTransaction();

    return wallet;
  } catch (e) {
    await session.abortTransaction();
    console.error(e);
  } finally {
    await session.endSession();
  }
}