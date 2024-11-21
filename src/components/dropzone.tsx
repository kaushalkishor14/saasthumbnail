import { Upload } from "lucide-react";

const Dropzone = ({
    setSelectedImage

}: {
    setSelectedImage: (file?: File) => void;

}) => {
    return (
        <div className="mt-16">
            <input
                onChange={(event) => setSelectedImage(event.target.files?.[0])}
                className="hidden"
                type="file"
                id="file-upload"
                accept="image/*"
            />
            <label
                htmlFor="file-upload"
                className="relative flex cursor-pointer w-full flex-col gap-2 rounded-2xl px-10  border border-gray-400 items-center justify-center bg-white py-10"
            >
                <div className="absolute inset-3 rounded-lg border border-dashed border-gray-400">
                </div>
                    <p className=" items-center text-sm text-gray-500">Upload an image</p>
                <Upload className="h-10 w-10 text-gray-300 items-center" />

            </label>
        </div>)
}

export default Dropzone;