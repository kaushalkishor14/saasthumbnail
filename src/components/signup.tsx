"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { signInSchema } from "~/schemas/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signup } from "~/app/action/auth";

type FormData = z.infer<typeof signInSchema>;

function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await signup(data.email, data.password);
    setLoading(false);

    if (result?.error) {
      toast({
        title: "Signup Failed",
        description: result.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed up successfully",
        variant: "default",
      });
      router.push("/signin");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <p className="leading-7">Go Back</p>
        </Link>
        <Card className="w-full max-w-sm p-4 ">
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>
              Enter your email address and password to sign up
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="DZkZc@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </Button>
              <Link href="/signin" className="text-sm underline">
                Already have an account?
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SignUp;
