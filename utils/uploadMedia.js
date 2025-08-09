// lib/uploadMedia.js

import cloudinary from "@/lib/cloudinary";

export const uploadToCloudinary = (buffer, folder = "uploads", resourceType = "image") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder },
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        }
        ).end(buffer);
    });
};