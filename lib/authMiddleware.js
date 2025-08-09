import jwt from "jsonwebtoken";

export function verifyUserToken(req) {
    const userToken = req.cookies.get("userToken")?.value;

    if (!userToken) {
        throw new Error("Not authenticated User");
    }

    try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
        return decoded; // { id: "userId" }
    } catch (error) {
        throw new Error("Invalid or expired user token");
    }
}

export function verifyAdminToken(req) {
    const adminToken = req.cookies.get("adminToken")?.value;

    if (!adminToken) {
        throw new Error("Not authenticated Admin");
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
        return decoded; // { email: "email" }
    } catch (error) {
        throw new Error("Invalid or expired admin token");
    }
}

export function verifyDoctorToken(req) {
    const doctorToken = req.cookies.get("doctorToken")?.value;

    if (!doctorToken) {
        throw new Error("Not authenticated Doctor");
    }

    try {
        const decoded = jwt.verify(doctorToken, process.env.JWT_SECRET);
        return decoded; // { id: "_id" }
    } catch (error) {
        throw new Error("Invalid or expired doctor token");
    }
}
