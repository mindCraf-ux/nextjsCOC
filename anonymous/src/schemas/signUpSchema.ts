import {z} from "zod";

export const usernameValidation = z
 .string()
 .min(2, "user must be atleast 2 characters long")
 .max(20, "username must be atmost 20 characters long")
 .regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers, and underscores");


 export const signUpSchema = z.object({
  username: usernameValidation,
email: z.string().email({message: "Please enter a valid email address"}),
password: z.string().min(6,{message: "Password must be at least 6 characters long"}),

 })