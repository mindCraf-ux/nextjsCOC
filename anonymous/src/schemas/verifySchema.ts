import {z} from "zod";

export const verifySchema = z.object({

  code: z.string().length(6, {message: "Verification code must be 6 characters long"}).regex(/^[0-9]+$/, "Verification code must be a number"),
})