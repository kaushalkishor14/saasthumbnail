import { z } from "zod"

export const signInSchema = z.object({
    email: z.string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
    // username: z.string({ required_error: "Username is required" })
    // .min(1, { message: "Username is required" }),
    password: z.string({ required_error: "Password is required" }).
    min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
});