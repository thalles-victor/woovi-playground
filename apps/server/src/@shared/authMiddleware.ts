// @ts-nocheck
import JWT from "jsonwebtoken";
import { PayloadType } from "./types";
import { CustomErrorResponse } from "../modules/error/validateSchema";
import { envParsed } from "../config"

export enum ROLE {
  ROOT = "ROOT",
  ADMIN = "ADMIN",
  USER = "USER",
}

export async function authMiddleware(
  accessToken: string,
  allowRoles: (keyof typeof ROLE)[]
) {
  if (!accessToken) {
    throw new CustomErrorResponse({
      message: "require access token",
      statusCode: 400,
    });
  }

  const [Bearer, token] = accessToken.split(" ");

  if (!Bearer || Bearer !== "Bearer") {
    throw new CustomErrorResponse({
      message: "require Bearer prefix",
      statusCode: 400,
    });
  }

  if (!token) {
    throw new CustomErrorResponse({
      message: "require content token",
      statusCode: 400,
    });
  }

  let payload: PayloadType;

  try {
    payload = JWT.verify(token, envParsed.JWT_SECRET, {
      ignoreExpiration: false,
    }) as PayloadType;
  } catch (e) {
    throw new CustomErrorResponse({
      message: "token invalid",
      statusCode: 401,
    });
  }

  if (allowRoles.length != 0)
    if (!allowRoles.includes(payload.role)) {
      throw new CustomErrorResponse({
        message: "access denied",
        statusCode: 403,
      });
    }

  return payload;
}
