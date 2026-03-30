"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Or your preferred notification library
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/user/send-reset-otp", { email });
      if (data.success) {
        toast.success(data.message);
        setIsOtpSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success("Password reset successful! Please login.");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isOtpSent ? "Reset Password" : "Forgot Password"}
        </h2>

        {!isOtpSent ? (
          /* Email Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                required
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              disabled={ !email || loading}
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary transition"
            >
              {loading ? "Sending..." : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          /* OTP & New Password Form */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP Code</label>
              <input
                type="text"
                maxLength={6}
                required
                className="w-full mt-1 p-2 border rounded-md text-center tracking-widest font-bold text-lg"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                className="w-full mt-1 p-2 border rounded-md outline-none"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              {loading ? "Resetting..." : "Update Password"}
            </button>
            <button
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;