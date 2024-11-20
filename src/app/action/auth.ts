"use server";

import { signInSchema } from "~/schemas/auth";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const signup = async (email: string, password: string) => {

    // validate

    const isValid = await signInSchema.safeParseAsync({ email, password });

    if (!isValid.success) {
        return {
            error: true,
            message: isValid.error.message,
        };
    }

    //  check user exists
    const existingUser = await db.user.findUnique({
        where: {
            email: isValid.data.email
        }
    })

    if (existingUser) {
        return {
            message: "User already exists",
        };
    }


    // hash the  password & encrypt
    const hashedPassword = await bcrypt.hash(isValid.data.password, 10);

    // create user 
    const newUser = await db.user.create({
        data: {
            email: isValid.data.email,
            password: isValid.data.password
        }
    })

    if (newUser) {
        return {
            ok: true,
            message: "User created successfully",
        };
    }



    // create a stripe user

    // redirect to sign in
    redirect("/signin")

}
// see if user exists
// if not, create user
// encrypt password
// redirect to sign in
// create a stripe user