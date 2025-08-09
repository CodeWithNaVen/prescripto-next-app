import cloudinary from "@/lib/cloudinary";


export const uploadToCloudinary = (buffer, folder = "uploads") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
        { resource_type: "image", folder },
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        }
        ).end(buffer);
    });
};
