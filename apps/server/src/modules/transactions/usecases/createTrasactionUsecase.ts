import mongoose from "mongoose";
import { z } from "zod";
import { PayloadType } from "../../../@shared/types";
import { CustomErrorResponse, validateSchema } from "../../error/validateSchema";
import { createTransactionSchema } from "./dtos";
import { TransactionModel } from "../TransactionModel"
import { UserModel } from "../../user/UserModel"
import { WalletModel } from "../../wallet/WalletModel"

export async function createTransactionUseCase(
  payload: PayloadType,
  trzDto: z.infer<typeof createTransactionSchema>
) {
  validateSchema(trzDto, createTransactionSchema);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await UserModel.findOne({ _id: payload.sub })
      .session(session)
      .exec();

    if (!user) {
      throw new CustomErrorResponse({
        message: "unregistered user",
        statusCode: 401,
      });
    }


    if (user.deletedAt) {
      throw new CustomErrorResponse({
        message: "user banned or deleted",
        statusCode: 403,
      });
    }

    const wallet = await WalletModel.findOne({
      userId: user._id.toHexString(),
    })
      .session(session)
      .exec();

    if (!wallet) {
      throw new CustomErrorResponse({
        message: "wallet not found, contact support",
        statusCode: 406,
      });
    }

    if (wallet.deletedAt) {
      throw new CustomErrorResponse({
        message: "account deleted or banned",
        statusCode: 406,
      });
    }

    if (wallet.balance < trzDto.value) {
      throw new CustomErrorResponse({
        message: "insufficient balance",
        statusCode: 406,
      });
    }

    // recipient check

    const recipient = await UserModel.findOne({
      cpfCnpj: trzDto.toCpfCnpj,
    })
      .session(session)
      .exec();

    if (!recipient || recipient.deletedAt) {
      throw new CustomErrorResponse({
        message: "transaction could not be performed",
        statusCode: 406,
      });
    }

    const recipientWallet = await WalletModel.findOne({
      cpfCnpj: recipient.cpfCnpj,
    })
      .session(session)
      .exec();

    if (!recipientWallet || recipientWallet.deletedAt) {
      throw new CustomErrorResponse({
        message: "transaction could not be performed",
        statusCode: 406,
      });
    }

    const myWallet = await WalletModel.findOneAndUpdate(
      { _id: wallet._id },
      {
        $inc: { balance: -trzDto.value },
      },
      {
        new: true,
        session,
      }
    ).exec();

    await WalletModel.findOneAndUpdate(
      { _id: recipientWallet.id },
      {
        $inc: { balance: +trzDto.value },
      },
      {
        new: true,
        session,
      }
    ).exec();

    const [transaction] = await TransactionModel.create(
      [
        {
          createdAt: new Date(),
          fromCpfCnpj: wallet.cpfCnpj,
          toCpfCnpj: recipient.cpfCnpj,
          value: trzDto.value,
        },
      ],
      {
        session,
      }
    );

    await session.commitTransaction();

    return {
      transaction,
      wallet: myWallet,
    };
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
}