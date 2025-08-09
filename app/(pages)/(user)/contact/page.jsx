"use client";
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Contact = () => {
  return (
    <div className="mx-4 my-8 sm:mx-[10%] space-y-20">
      {/* Header */}
      <div className="text-center text-3xl pt-10 font-bold text-gray-800">
        <p>
          CONTACT <span className="text-primary">US</span>
        </p>
        <p className="text-sm font-normal mt-2 text-gray-500">
          We’d love to hear from you! Get in touch with our team below.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-10 text-sm">
        {/* Left Side - Contact Info */}
        <div className="flex-1 flex flex-col gap-6 border border-primary rounded-md p-6 shadow-md bg-white">
          <Image
            src={assets.contact_image}
            alt="contact"
            className="w-full h-auto rounded-md"
          />

          <div className="space-y-4">
            <div>
              <b className="text-base text-primary">📍 OUR OFFICE</b>
              <p className="mt-1 text-gray-700">
                54709 Wilims Station
                <br />
                Suite 350, Washington, USA
              </p>
            </div>

            <div>
              <b className="text-base text-primary">📞 REACH US</b>
              <p className="mt-1 text-gray-700">
                Phone: (241) 968-025 <br />
                Email: naveenshah.dev@gmail.com
              </p>
            </div>

            <div>
              <b className="text-base text-primary">🕘 BUSINESS HOURS</b>
              <p className="mt-1 text-gray-700">
                Mon–Fri: 9:00 AM – 6:00 PM <br />
                Sat: 10:00 AM – 2:00 PM <br />
                Sun: Closed
              </p>
            </div>

            <div>
              <b className="text-base text-primary">💼 CAREERS AT PRESCRIPTO</b>
              <p className="mt-1 text-gray-700">
                We're always looking for talented people to join our team.
              </p>
              <button className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:scale-105 transition-all duration-300">
                Explore Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="flex-1 border border-primary rounded-md p-6 shadow-md bg-white h-max">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            📬 Send Us a Message
          </h2>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border px-4 py-2 rounded-md focus:outline-primary"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border px-4 py-2 rounded-md focus:outline-primary"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className="border px-4 py-2 rounded-md focus:outline-primary"
            />
            <textarea
              rows={5}
              placeholder="Your Message"
              className="border px-4 py-2 rounded-md focus:outline-primary"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:scale-105 transition duration-300 w-fit cursor-pointer"
            >
              Submit Message
            </button>
          </form>
        </div>
      </div>

      {/* Optional - Map */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          📍 Visit Our Hospital
        </h2>
        <div className="w-full h-[300px] rounded-md overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.0028165876674!2d85.3362288751469!3d27.68630782641969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1994769ac19f%3A0xd15dddabb04dbed!2sCivil%20Service%20Hospital%20of%20Nepal!5e0!3m2!1sen!2snp!4v1754228218486!5m2!1sen!2snp"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
