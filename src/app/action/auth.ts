"use server";

import { signInSchema } from "~/schemas/auth";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const signup = async (email: string, password: string) => {
  try {
    // Validate inputs
    const isValid = await signInSchema.safeParseAsync({ email, password });
    if (!isValid.success) {
      return {
        error: true,
        message: isValid.error.message,
      };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: isValid.data.email,
      },
    });

    if (existingUser) {
      return {
        message: "User already exists",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(isValid.data.password, 10);

    // Create new user in the database
    const newUser = await db.user.create({
      data: {
        email: isValid.data.email,
        password: hashedPassword, // Store hashed password
      },
    });

    // If user creation is successful, handle redirection
    if (newUser) {
      // You can optionally create a Stripe user here

      // Redirect to the signin page
      redirect("/signin");
    } else {
      return {
        error: true,
        message: "Error creating user.",
      };
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      error: true,
      message: "An unexpected error occurred.",
    };
  }
};
