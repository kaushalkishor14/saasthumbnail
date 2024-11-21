"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "./dropzone";
import Style from "./style";
import { set } from "zod";
import { removeBackground } from "@imgly/background-removal"
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";



const presets ={
    style1:{
        fontSize: 100,
        fontWeight: "bold",
        color : "rgba(255, 255, 255,1)",
        opacity: 1

    },
    style2:{
        fontSize: 100,
        fontWeight: "bold", 
        color : "rgba(0, 0, 0,1)",
        opacity: 1
    },
    style3:{
        fontSize: 100,
        fontWeight: "bold", 
        color : "rgba(255, 255, 255, 0.8)",
        opacity: 0.8
    }

}


const ThumbnailCreator = () => {

    const [selectStyle, setSelectStyle] = useState("style1");
    const [loading, setLoading] = useState(false);
    const [imageSrc, setImageSrc] = useState<String | null>(null);

    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [canvasReady, setCanvasReady] = useState(false);


    const [text, setText] = useState("Pov");

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
            let selectFont = "Arial";
            ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;

            const textWidth = ctx.measureText(text).width;
            const targetWidth = canvas.width * 0.9;
            fontSize *= targetWidth / textWidth ;

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
                                <div className="my-4 flex flex-col items-center w-full gap-3">
                                    
                                    <button
                                    onClick={() => {
                                        setImageSrc(null)
                                        setCanvasReady(false)
                                        setProcessedImage(null)
                                    }


                                    }
                                    className="flex gap-2 items-center self-start">
                                        <ArrowLeft className="h-4 w-4"/>
                                        <p className="leading-7">Go back</p>
                                    </button>
                                <canvas ref={canvasRef} className="max-h-lg h-auto max-w-lg rounded-lg">

                                </canvas>
                                <Button onClick={()=>handleDownload()}>Download</Button>
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
                    </div>
                )}


        </>
    )
};



export default ThumbnailCreator