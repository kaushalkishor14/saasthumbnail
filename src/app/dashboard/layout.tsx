import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex h-screen w-full flex-col items-center overflow-y-scroll px-6 py-6 ">
    <nav className="flex w-full items-center justify-between pb-6"></nav>
    {children}
    </div>
}
