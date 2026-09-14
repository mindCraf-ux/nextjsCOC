import {z} from "zod";

export const useernameValidation = z
 .string()
 .min(2, "user must be atleast 2 characters long")
 .max(20, "username must be atmost 20 characters long")
 .regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers, and underscores");
