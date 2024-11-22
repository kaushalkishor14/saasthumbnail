"use  server";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Recent = () => {
    return (
        <div className="flex flex-col ">

            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Recent thumbnails</h3>

            <p className="text-sm text-muted-foreground"> Download your most recent thumbnails</p>
            <Separator className="my-2" />
            <div className="flex h-fit max-w-full gap-2 overflow-x-scroll">
                <div className="flex min-w-fit flex-col gap-1">
                    <img
                        src="/thumbnail(1).png"
                        alt="thumbnail"
                        className="h-56 w-auto rounded-lg object-contain"

                    />
                    <p className="text-sm"> From {""}{new Date().toLocaleDateString("en-In", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })} ,
                    </p>
                    <Button className="w-full" variant={"outline"}>Download</Button>

                </div>
                <div className="flex min-w-fit flex-col gap-1">
                    <img
                        src="/thumbnail(1).png"
                        alt="thumbnail"
                        className="h-56 w-auto rounded-lg object-contain"

                    />
                    <p className="text-sm"> From {""}{new Date().toLocaleDateString("en-In", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })} ,
                    </p>
                    <Button className="w-full" variant={"outline"}>Download</Button>

                </div>
                <div className="flex min-w-fit flex-col gap-1">
                    <img
                        src="/thumbnail(1).png"
                        alt="thumbnail"
                        className="h-56 w-auto rounded-lg object-contain"

                    />
                    <p className="text-sm"> From {""}{new Date().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })} ,
                    </p>
                    <Button className="w-full mt-2" variant={"outline"}>Download</Button>

                </div>

            </div>
        </div>
    )
}


export default Recent