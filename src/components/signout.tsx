"use client"

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const Signout = () => {

    return (
        <LogOut
            onClick={() => signOut()}
            className="h-6 w-6 cursor-pointer"
        />


    )

}


export default Signout;