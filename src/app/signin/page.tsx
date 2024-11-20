"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth/config";
import { redirect } from "next/navigation";
import SignIn from "~/components/signin";

const Page = async () => {
  const session = await getServerSession(authOptions);
  console.log("session", session);
    if (session?.user) {
      // Redirect to dashboard if user is authenticated
      redirect("/dashboard");
    }
  

    // Render fallback UI for unauthenticated users
    return <>
    <SignIn/>
    </>
  
}
export default Page;
