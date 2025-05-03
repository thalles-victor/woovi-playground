// @ts-nocheck
import { z } from "zod";

export const createTransactionSchema = z.object({
  toCpfCnpj: z.string().nonempty(),
  value: z.number().min(1).max(15000),
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;