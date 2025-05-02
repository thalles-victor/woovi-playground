import JWT from "jsonwebtoken"
import { AuthResponse, SignInDto, signInDtoSchema } from "./auth.dtos";
import { CustomErrorResponse, validateSchema } from "../../error/validateSchema"
import { UserModel } from "../../user/UserModel"
import * as bcrypt from "bcrypt"
import { PayloadType } from "../../../@shared/types";
import { envParsed } from "../../../config"

export async function signInUseCase(signInDto: SignInDto): Promise<AuthResponse> {
  validateSchema(signInDto, signInDtoSchema);

  const userExist = await UserModel.findOne({
    email: signInDto.email,
  }).exec();

  if (!userExist) {
    throw new CustomErrorResponse({
      message: "user not found",
      statusCode: 404,
    });
  }

  if (userExist.deletedAt) {
    throw new CustomErrorResponse({
      message: "user deleted or banned",
      statusCode: 406,
    });
  }

  const passwordMatches = await bcrypt.compare(
    signInDto.password,
    userExist.password
  );

  if (!passwordMatches) {
    throw new CustomErrorResponse({
      message: "invalid password",
      statusCode: 401,
    });
  }

  const payload: PayloadType = {
    sub: userExist._id.toString(),
    role: userExist.role,
  };

  const token = JWT.sign(payload, envParsed.JWT_SECRET, {
    expiresIn: "24h",
  });

  return {
    user: {
      name: userExist.name,
      email: userExist.email,
      createdAt: userExist.createdAt,
      updatedAt: userExist.updatedAt,
      deletedAt: userExist.deletedAt,
      role: userExist.role,
    },
    accessToken: {
      token,
      expiresIn: "24h",
    },
  };
}