import {z} from "zod"
 

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