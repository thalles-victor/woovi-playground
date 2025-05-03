// @ts-nocheck
import { CustomErrorResponse, validateSchema } from "../../error/validateSchema";
import { AuthResponse, SignUpDto, signUpDtoSchema } from "./auth.dtos";
import mongoose from "mongoose"
import { UserModel } from "../../user/UserModel";
import JWT from "jsonwebtoken"
import { WalletModel } from "../../wallet/WalletModel";
import { PayloadType } from "../../../@shared/types";
import { envParsed } from "../../../config";
import * as bcrypt from "bcrypt"
import { ROLE } from "../../../@shared/metadata";

export async function signUpUseCase(signUpDto: SignUpDto): Promise<AuthResponse> {
  validateSchema(signUpDto, signUpDtoSchema);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userExistByEmail = await UserModel.findOne({
      email: signUpDto.email,
    }).exec();

    if (userExistByEmail) {
      throw new CustomErrorResponse({
        message: "email in used",
        statusCode: 401,
      });
    }

    const userExistByCpfCnpj = await UserModel.findOne({
      cpfCnpj: signUpDto.cpfCnpj,
    });

    if (userExistByCpfCnpj) {
      throw new CustomErrorResponse({
        message: "cpf or cnpj in used",
        statusCode: 406,
      });
    }

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(signUpDto.password, salt)
    const userRole: keyof typeof ROLE = envParsed.ADMIN_EMAIL === signUpDto.email ? "ADMIN" : "USER"

    const [userCreated] = await UserModel.create(
      [
        {
          name: signUpDto.name,
          email: signUpDto.email,
          cpfCnpj: signUpDto.cpfCnpj,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          role: userRole
        },
      ],
      {
        session,
      }
    );

    await WalletModel.create(
      [
        {
          balance: 10000,
          userId: userCreated._id.toString(),
          cpfCnpj: userCreated.cpfCnpj,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        session,
      }
    );

    const payload: PayloadType = {
      sub: userCreated._id.toString(),
      role: userCreated.role,
    }


    const token = JWT.sign(payload, envParsed.JWT_SECRET, {
      expiresIn: envParsed.JWT_EXPIRES_IN as any,
    });


    await session.commitTransaction();

    return {
      user: {
        name: userCreated.name,
        email: userCreated.email,
        deletedAt: userCreated.deletedAt,
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
        role: userCreated.role,
      },
      accessToken: {
        token,
        expiresIn: envParsed.JWT_EXPIRES_IN,
      }
    };
  } catch (e) {
    session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}