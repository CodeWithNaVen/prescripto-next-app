import cloudinary from "@/lib/cloudinary";


export const deleteFromCloudinary = async (url) => {
    try {
        // Extract publicId with folder
        const parts = url.split("/");
        const resourceType = url.includes("/video/") ? "video" : "image";

        const uploadIndex = parts.indexOf("upload");
        const publicIdWithVersion = parts.slice(uploadIndex + 1).join("/"); // includes version
        const publicId = publicIdWithVersion.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, ""); // remove version & extension

        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        return { success: true };
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
        return { success: false, error };
    }
};
