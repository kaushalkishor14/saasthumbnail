"use client"


import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { signInSchema } from "~/schemas/auth"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { toast } from "~/hooks/use-toast"
import { useRouter } from "next/navigation"

type FormData = z.infer<typeof signInSchema>

function SignIn() {


  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async (data: FormData) => {
    const res = await signIn(
      'credentials',
      {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
        redirect: false
      })
     if(res?.error){
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive"
      })
     } else if(res?.ok){
     router.push("/dashboard")
      toast({
        title: "Success",
        description: "Signed in successfully",
        variant: "default"
      })
     }


   

  }


  return (
    <div className=" flex h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <p className="leading-7">Go Back</p>
        </Link>
        <Card className="w-full max-w-sm p-4 ">
          <CardHeader>
            <CardTitle className="text-2xl  ">Sign in</CardTitle>
            <CardDescription>
              Enter your email address and password to sign in
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className=" grid gap-4">
              <div className="grid gap-2 ">
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
              <div className="grid gap-2 ">
                <Label htmlFor="email">Password</Label>
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
            <CardFooter className="flex  flex-col gap-2">
              <Button type="submit">Sign in </Button>

              <Link href="/signup" className="text-sm underline">
                <Button variant="link">
                  Don't have an account?
                </Button>
              </Link>

            </CardFooter>
          </form>
        </Card>
      </div>

    </div>
  )
}

export default SignIn