import { verifyUserToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import userModel from "@/models/user";
import { uploadToCloudinary } from "@/utils/uploadMedia";
import { deleteFromCloudinary } from "@/utils/deleteMedia";

export const PUT = async (req) => {
    try {
        await connectDB();

        // 1. Verify user
        const user = verifyUserToken(req);
        const userId = user.id;

        // 2. Get form data
        const formData = await req.formData();
        if (!formData) {
        return Response.json({ success: false, message: "No data to update" }, { status: 400 });
        }

        // 3. Basic fields
        const name = formData.get("name");
        const phone = formData.get("phone");
        const gender = formData.get("gender");
        const dob = formData.get("dob");
        const address = formData.get("address");
        const line1 = address ? JSON.parse(address).line1 : "";
        const line2 = address ? JSON.parse(address).line2 : "";

        const updateData = {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(gender && { gender }),
        ...(dob && { dob }),
        address: { line1: line1 || "", line2: line2 || "" },
        };

        // 4. Fetch existing user
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
        return Response.json({ success: false, message: "User not found to update info" }, { status: 404 });
        }

        // 5. Upload new profile image (and delete old one)
        const profileImageFile = formData.get("profileImage");
        if (profileImageFile && typeof profileImageFile.name === "string") {
        if (existingUser.profileImage && !existingUser.profileImage.startsWith("data:image")) {
            await deleteFromCloudinary(existingUser.profileImage); // ✅ delete old
        }

        const profileBuffer = Buffer.from(await profileImageFile.arrayBuffer());
        const uploadedProfile = await uploadToCloudinary(profileBuffer, "user-profile");
        updateData.profileImage = uploadedProfile.secure_url;
        }

        // 6. Upload additional patient images
        const imageFiles = formData.getAll("images");
        const uploadedImages = [];

        for (const img of imageFiles) {
        if (img && typeof img.name === "string") {
            const buffer = Buffer.from(await img.arrayBuffer());
            const uploaded = await uploadToCloudinary(buffer, "patient-images");
            uploadedImages.push(uploaded.secure_url);
        }
        }

        if (uploadedImages.length > 0) {
        updateData.images = [...(existingUser.images || []), ...uploadedImages];
        }

        // 7. Upload videos (if any)
        const videoFiles = formData.getAll("videos");
        const uploadedVideoUrls = [];

        for (const videoFile of videoFiles) {
        if (videoFile && typeof videoFile.name === "string") {
            const buffer = Buffer.from(await videoFile.arrayBuffer());
            const uploadedVideo = await uploadToCloudinary(buffer, "user-videos", "video");
            uploadedVideoUrls.push(uploadedVideo.secure_url);
        }
        }

        if (uploadedVideoUrls.length > 0) {
        updateData.videoUrls = [...(existingUser.videoUrls || []), ...uploadedVideoUrls];
        }

        // 8. Update user in DB
        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        return Response.json({
        success: true,
        message: "Profile updated successfully",
        userData: updatedUser,
        }, { status: 200 });

    } catch (error) {
        console.error("Profile update error:", error);
        return Response.json({ success: false, message: "Failed to update profile" }, { status: 500 });
    }
};
