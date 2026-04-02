"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { assets } from "@/assets/assets";

const RegisterPage = () => {
    const { user, router, loadingUser } = useAppContext();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
        const res = await axios.post("/api/auth/user/register", formData);
        if (res.data.success) {
            toast.success(res.data.message);
            router.push("/"); // Redirect after successful register
        } else {
            setErrorMsg(res.data.message);
        }
        } catch (err) {
        setErrorMsg(err.response?.data?.message || "Something went wrong");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingUser && user) {
        router.push("/");
        }
    }, [user, loadingUser, router]);

    if (loadingUser || user) {
        return null;
    }

    return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
          {/* logo */}
          <Image 
            src={assets.logo}
            alt="Logo"
            width={1000}
            height={1000}
            className="mx-auto h-12 w-auto mb-6"
          />
          <h2 className="text-2xl font-semibold text-center">
            Create Account
          </h2>
          <p className="text-gray-600 text-center mb-3">Create an account to access all the features</p>

          {errorMsg && (
            <p className="text-red-500 mb-4 text-sm text-center">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter a password (min 6 characters)"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition active:scale-95 duration-300 cursor-pointer"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
