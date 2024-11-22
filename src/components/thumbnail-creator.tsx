"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "./dropzone";
import Style from "./style";
import { set } from "zod";
import { removeBackground } from "@imgly/background-removal"
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { inter, domine } from "../app/font";

const presets = {
    style1: {
        fontSize: 100,
        fontWeight: "bold",
        color: "rgba(255, 255, 255,1)",
        opacity: 1

    },
    style2: {
        fontSize: 100,
        fontWeight: "bold",
        color: "rgba(0, 0, 0,1)",
        opacity: 1
    },
    style3: {
        fontSize: 100,
        fontWeight: "bold",
        color: "rgba(255, 255, 255, 0.8)",
        opacity: 0.8
    }

}

interface CloudinarySignature {
    signature: string;
    timestamp: number;
    folder: string;
    cloud_name: string;
    api_key: string;
  }

const ThumbnailCreator = ({children} : {children: React.ReactNode}) => {

    const [selectStyle, setSelectStyle] = useState("style1");
    const [loading, setLoading] = useState(false);
    const [imageSrc, setImageSrc] = useState<String | null>(null);

    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [canvasReady, setCanvasReady] = useState(false);


    const [text, setText] = useState("Pov");
    const [font, setFont] = useState("arial");


    const canvasRef = useRef<HTMLCanvasElement>(null);


    const setSelectedImage = async (file?: File) => {
        if (file) {
            setLoading(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const src = e.target?.result as string;
                setImageSrc(src);

                const blob = await removeBackground(src);
                const processUrl = URL.createObjectURL(blob);
                setProcessedImage(processUrl);
                setCanvasReady(true);
                setLoading(false);

            };
            reader.readAsDataURL(file);

        }
    };


    useEffect(() => {
        if (canvasReady) {
            drawCompositeImage();
        }

    }, [canvasReady]);


    const drawCompositeImage = () => {
        if (!canvasRef.current || !canvasReady || !imageSrc || !processedImage) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bgImage = new Image();

        bgImage.onload = () => {
            canvas.width = bgImage.width;
            canvas.height = bgImage.height;

            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            let preset = presets.style1;
            switch (selectStyle) {

                case "style2":
                    preset = presets.style2;
                    break;
                case "style3":
                    preset = presets.style3;
                    break;
            }

            ctx.save();

            // calculate font size to fill image 90% of the canvas

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";


            let fontSize = 100;
            let selectFont = "arial";

            switch (font) {

                case "Times New Roman":
                    selectFont = "Times New Roman";
                    break;
                case "inter":
                    selectFont = inter.style.fontFamily;
                    break;
                case "Verdana":
                    selectFont = "Verdana";
                    break;
                case "domine":
                    selectFont = domine.style.fontFamily;
                    break;
            }

            ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;

            const textWidth = ctx.measureText(text).width;
            const targetWidth = canvas.width * 0.9;
            fontSize *= targetWidth / textWidth;

            ctx.font = `${"bold"} ${fontSize}px ${selectFont}`;

            ctx.fillStyle = preset.color;
            ctx.globalAlpha = preset.opacity;

            const x = canvas.width / 2;
            const y = canvas.height / 2;

            ctx.translate(x, y);
            ctx.fillText(text, 0, 0);
            ctx.restore();

            const fgImg = new Image();
            fgImg.onload = () => {
                ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
            };
            fgImg.src = processedImage;

        };

        bgImage.src = imageSrc as string;

    }

    const handleDownload = async () => {
        if (canvasRef.current) {
            const link = document.createElement("a");
            link.download = "thumbnail.png";
            link.href = canvasRef.current.toDataURL();
            link.click();


            canvasRef.current.toBlob(async (blob) => {
                if (blob) {
                  try {
                    // Step 1: Fetch Cloudinary signature from API
                    const response = await fetch("/api/getUploadSignature", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        folder: "user_images", // Optional folder name
                      }),
                    });
          
                    if (!response.ok) throw new Error("Failed to get upload signature");
          
                    const data: CloudinarySignature = await response.json();
          
                    // Step 2: Prepare FormData
                    const formData = new FormData();
                    formData.append("file", blob);
                    formData.append("api_key", data.api_key);
                    formData.append("timestamp", data.timestamp.toString());
                    formData.append("signature", data.signature);
                    formData.append("folder", data.folder);
          
                    // Step 3: Upload to Cloudinary
                    const uploadResponse = await fetch(
                      `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
                      {
                        method: "POST",
                        body: formData,
                      }
                    );
          
                    if (uploadResponse.ok) {
                      const result = await uploadResponse.json();
                      console.log("Uploaded successfully to:", result.secure_url);
                    } else {
                      console.error("Failed to upload to Cloudinary");
                    }
                  } catch (error) {
                    console.error("Error uploading file", error);
                  }
                }
              }, "image/png");
            }
        

        
    }



    return (
        <>

            {imageSrc ?
                (
                    <>
                        {loading ? <div className="flex items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-lg border-2 border-gray-800 border-dashed"></div></div> :
                            (
                                <div className="flex w-full max-w-2xl flex-col items-center gap-5">
                                    <div className="my-4 flex flex-col items-center w-full gap-3">
                                        <button
                                            onClick={() => {
                                                setImageSrc(null)
                                                setCanvasReady(false)
                                                setProcessedImage(null)
                                            }}
                                            className="flex gap-2 items-center self-start"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            <p className="leading-7">Go back</p>
                                        </button >
                                        <canvas ref={canvasRef} className="max-h-lg w-full h-auto max-w-lg rounded-lg">
                                        </canvas>
                                    </div>

                                    <Card className="w-full">
                                        <CardHeader >
                                            <CardTitle>Edit your thumbnail</CardTitle>

                                        </CardHeader>
                                        <CardContent>

                                            <div className="grid w-full items-center gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <Label htmlFor="inputid">text</Label>
                                                    <Input
                                                        value={text}
                                                        onChange={(e) => setText(e.target.value)}
                                                        id="inputid"
                                                        placeholder="Type your text here"
                                                    />

                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <Label htmlFor="font">text</Label>
                                                    <Select
                                                        value={font}
                                                        onValueChange={(value) => setFont(value)}

                                                    >
                                                        <SelectTrigger id="font">
                                                            <SelectValue placeholder="Select a font" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectItem value="arial">Arial</SelectItem>
                                                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                                            <SelectItem value="inter">Inter</SelectItem>
                                                            <SelectItem value="Verdana">Verdana</SelectItem>
                                                            <SelectItem value="domine">Domine</SelectItem>
                                                        </SelectContent>

                                                    </Select>

                                                </div>


                                            </div>

                                        </CardContent>
                                        <CardFooter className="flex flex-wrap justify-between gap-2">
                                            <Button onClick={() => handleDownload()}>Download</Button>
                                            <Button onClick={drawCompositeImage}>Update</Button>

                                        </CardFooter>
                                    </Card>

                                </div>
                            )}
                    </>
                ) : (
                    <div className="flex flex-col mt-10">
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Hi there</h1>
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Want to create a thumbnail?
                        </h1>
                        <p className="leading-7 text-muted-foreground mt-2">
                            Use one of the thumbnails below
                        </p>
                        <div className="flex mt-10 flex-col md:flex-row items-center justify-between gap-8 md:items-start">
                            <Style image="/thumbnail(1).png" selectStyle={() => setSelectStyle("style1")} isSelected={selectStyle === "style1"} />
                            <Style image="/thumbnail(2).png" selectStyle={() => setSelectStyle("style2")} isSelected={selectStyle === "style2"} />
                            <Style image="/thumbnail(3).png" selectStyle={() => setSelectStyle("style3")} isSelected={selectStyle === "style3"} />


                        </div>
                        <Dropzone setSelectedImage={setSelectedImage} />
                        <div className="mt-8">
                           {children}

                        </div>
                    </div>
                )}


        </>
    )
}



export default ThumbnailCreator