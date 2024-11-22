import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface SignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
  cloud_name: string;
  api_key: string;
}

interface RequestBody {
  folder?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureResponse | { error: string }>
) {
  if (req.method === "POST") {
    try {
      const { folder }: RequestBody = req.body;
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folderName = folder || "uploads";  // Default folder if not provided

      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ error: "Missing Cloudinary configuration" });
      }

      // Correct the call to sign_request
      const signature = cloudinary.utils.sign_request(
        {
          timestamp,
          folder: folderName,
          api_key: process.env.CLOUDINARY_API_KEY!,
        },
        process.env.CLOUDINARY_API_SECRET! // Pass api_secret as the second argument
      );

      console.log("Cloudinary signature:", signature);
      res.status(200).json({
        signature,
        timestamp,
        folder: folderName,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
      });
    } catch (error: any) {
      console.error("Error generating Cloudinary signature:", error);
      res.status(500).json({ error: error.message || "Error generating Cloudinary signature" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
