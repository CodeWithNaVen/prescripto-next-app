"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
    const path = usePathname();

    const { router, user, axios, getUserProfile } = useAppContext();
    const [showMenu, setShowMenu] = useState(false);


    const logout = async() => {
        try {
            const res = await axios.get('/api/auth/user/logout');
            const data = res.data;

            if(data.success){
                router.push('/login');
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

  return (
    <div className="flex items-center justify-between text-sm px-6 py-4 mb-5 border-b-2 border-gray-200 shadow">
      <Image
        onClick={() => router.push("/")}
        src={assets.logo}
        height={50}
        width={50}
        alt=""
        className="w-44 cursor-pointer"
      />

      {/* desktop menu */}
      <ul className="hidden md:flex items-start gap-5 font-medium text-base">
        <Link href="/">
          <li className="py-1">HOME</li>
          <hr
            className={`${
              path === "/" ? "block" : "hidden"
            } border-none outline-none h-0.5 w-3/4 m-auto bg-primary cursor-pointer`}
          />
        </Link>
        <Link href="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr
            className={`${
              path === "/doctors" ? "block" : "hidden"
            } border-none outline-none h-0.5 w-3/4 m-auto bg-primary`}
          />
        </Link>
        <Link href="/about">
          <li className="py-1">ABOUT</li>
          <hr
            className={`${
              path === "/about" ? "block" : "hidden"
            } border-none outline-none h-0.5 w-3/4 m-auto bg-primary`}
          />
        </Link>
        <Link href="/contact">
          <li className="py-1">CONTACT</li>
          <hr
            className={`${
              path === "/contact" ? "block" : "hidden"
            } border-none outline-none h-0.5 w-3/4 m-auto bg-primary`}
          />
        </Link>
      </ul>

      {/* menu toggle + mobile menu container */}
      <div className="flex items-center gap-4 relative">
        {user ? (
          <div className="flex items-center gap-1 cursor-pointer group relative">
            <Image
              src={assets.dropdown_icon}
              height={50}
              width={50}
              alt=""
              className="w-3 mt-3"
            />
            <Image
              src={user.profileImage}
              height={50}
              width={50}
              alt=""
              className="rounded-full border border-primary max-sm:h-8 max-sm:w-8 w-12 h-12"
            />

            {/* dropdown menu */}
            <div className="absolute right-3 -top-1 mt-10 text-base font-medium text-gray-800 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => router.push("my-profile")}
                  className="hover:text-primary cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => router.push("my-appointments")}
                  className="hover:text-primary cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-primary cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-primary text-white px-4 py-2 rounded-md font-light hidden md:block cursor-pointer"
          >
            Get Started
          </button>
        )}

        {/* Toggle icon */}
        {showMenu ? (
          <Image
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            height={50}
            width={50}
            alt=""
            className="w-8 cursor-pointer md:hidden"
          />
        ) : (
          <Image
            onClick={() => setShowMenu(true)}
            src={assets.menu_icon}
            height={50}
            width={50}
            alt=""
            className="w-6 md:hidden cursor-pointer"
          />
        )}

        {/* Mobile menu */}
        <div
          className={`absolute top-14 right-0 z-50 bg-white transition-all duration-300 ease-in-out overflow-hidden rounded-md shadow-lg ${
            showMenu ? "w-64 p-4" : "w-0 p-0"
          }`}
        >
          <ul className="flex flex-col items-start gap-2 text-lg font-medium whitespace-nowrap">
            <Link href="/" onClick={() => setShowMenu(false)}>
              <p
                className={`py-2 px-4 rounded-md inline-block ${
                  path === "/" ? "text-primary" : ""
                }`}
              >
                HOME
              </p>
            </Link>
            <Link href="/doctors" onClick={() => setShowMenu(false)}>
              <p
                className={`py-2 px-4 rounded-md inline-block ${
                  path === "/doctors" ? "text-primary" : ""
                }`}
              >
                ALL DOCTORS
              </p>
            </Link>
            <Link href="/about" onClick={() => setShowMenu(false)}>
              <p
                className={`py-2 px-4 rounded-md inline-block ${
                  path === "/about" ? "text-primary" : ""
                }`}
              >
                ABOUT
              </p>
            </Link>
            <Link href="/contact" onClick={() => setShowMenu(false)}>
              <p
                className={`py-2 px-4 rounded-md inline-block ${
                  path === "/contact" ? "text-primary" : ""
                }`}
              >
                CONTACT
              </p>
            </Link>
            {user ? <button onClick={logout} className="bg-primary text-white px-10 py-2 rounded-md font-light mt-2 cursor-pointer">Logout</button>:
            <button
              onClick={() => {
                router.push("/login");
                setShowMenu(false);
              }}
              className="bg-primary text-white px-10 py-2 rounded-md font-light mt-2 cursor-pointer"
            >
              Login
            </button>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
