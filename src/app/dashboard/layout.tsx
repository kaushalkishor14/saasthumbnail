"use server"
import "~/styles/globals.css";


import Link from "next/link";
import { Button } from "~/components/ui/button";
import Signout from "~/components/signout";
import Credits from "~/components/credits";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex h-screen w-full flex-col items-center overflow-y-scroll px-6 py-6  bg-gradient-to-r from-indigo-500 via-purple-50 to-pink-5 ">
    <nav className="flex w-full items-center  pb-6 justify-end">
      <div className="flex items-center gap-4 ">
        
     <Credits/>
      <Link href='/dashboard/pricing'>
      <Button>Buy more</Button>
      </Link>
      <Signout/>
      </div>

    </nav>
    {children}
    </div>
}
