import { z } from "zod"
import { RoleType } from "../../../@shared/types"

export type AuthResponse = {
  user: {
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    role: RoleType,
  },
  accessToken: {
    token: string,
    expiresIn: string,
  }
}

export const signUpDtoSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  cpfCnpj: z.string().min(11).max(14),
})

export type SignUpDto = z.infer<typeof signUpDtoSchema>


export const signInDtoSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export type SignInDto = z.infer<typeof signInDtoSchema>

