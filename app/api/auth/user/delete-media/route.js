// app/api/auth/user/delete-media/route.js

import { verifyUserToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import userModel from "@/models/user";
import { deleteFromCloudinary } from "@/utils/deleteMedia";

export const DELETE = async (req) => {
    try {
        await connectDB();

        // 1. Verify user
        const authUser = verifyUserToken(req);
        const userId = authUser.id;

        const { mediaUrl, type } = await req.json();

        if (!mediaUrl || !type || !["image", "video"].includes(type)) {
            return Response.json(
                { success: false, message: "Invalid request. mediaUrl and type are required." },
                { status: 400 }
            );
        }

        // 2. Delete from Cloudinary
        const result = await deleteFromCloudinary(mediaUrl);
        if (!result.success) {
            return Response.json(
                { success: false, message: "Failed to delete from Cloudinary" },
                { status: 500 }
            );
        }

        // 3. Update user document
        const field = type === "video" ? "videoUrls" : "images";
        const user = await userModel.findById(userId);

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        user[field] = user[field].filter((url) => url !== mediaUrl);
        await user.save();

        return Response.json({ success: true, message: `${type} deleted successfully`, updatedUser: user },{ status: 200 });
    } catch (error) {
        console.error("Media deletion error:", error);
        return Response.json({ success: false, message: "Failed to delete media" }, { status: 500 });
    }
};
