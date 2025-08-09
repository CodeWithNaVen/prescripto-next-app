"use client";
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const About = () => {
  const { router } = useAppContext();

  const services = [
    {
      title: "EFFICIENCY",
      desc: "Streamlined scheduling, real-time updates, and optimized health record management.",
    },
    {
      title: "CONVENIENCE",
      desc: "Access healthcare from anywhere, anytime — no queues, no waiting rooms.",
    },
    {
      title: "SAFETY",
      desc: "Data security, verified professionals, and protected user privacy at every step.",
    },
    {
      title: "SUPPORT",
      desc: "24/7 support to guide, assist, and empower your healthcare experience.",
    },
  ];

  const offers = [
    {
      title: "Online Consultation",
      desc: "Consult licensed doctors and specialists via video call — securely and instantly.",
    },
    {
      title: "Digital Prescriptions",
      desc: "Receive, view, and share your prescriptions digitally — anytime you need.",
    },
    {
      title: "Health Record Management",
      desc: "All your medical history stored safely in one place — accessible from any device.",
    },
    {
      title: "Appointment Scheduling",
      desc: "Book, reschedule, or cancel appointments with just a few clicks.",
    },
    {
      title: "Medication Reminders",
      desc: "Stay on track with automatic reminders for your prescriptions and checkups.",
    },
    {
      title: "Secure Messaging",
      desc: "Chat with healthcare professionals while ensuring your data remains encrypted.",
    },
  ];

  const testimonials = [
    {
      name: "Anjali Sharma",
      feedback:
        "Prescripto made it easy to get help for my chronic condition without needing to visit multiple clinics.",
    },
    {
      name: "Ravi Thapa",
      feedback:
        "Excellent UI, smooth experience. Booking an appointment takes seconds!",
    },
    {
      name: "Sita Gurung",
      feedback:
        "I love that I can access all my medical history in one place. Very helpful for me and my family.",
    },
  ];

  return (
    <div className="mx-4 my-8 sm:mx-[10%] space-y-20">
      {/* Header */}
      <div className="text-center text-3xl pt-10 text-gray-800 font-bold tracking-wide">
        <p>
          ABOUT <span className="text-primary">US</span>
        </p>
      </div>

      {/* About Intro */}
      <div className="flex flex-col md:flex-row gap-12">
        <Image
          src={assets.about_image}
          width={0}
          height={0}
          alt="About Us"
          className="w-full md:max-w-[360px] rounded-md object-cover shadow-md"
        />

        <div className="flex flex-col gap-6 md:w-2/4 text-sm md:text-base text-gray-800 border-primary border rounded-md shadow-lg p-6 bg-white">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-primary">Prescripto</span>, your
            trusted partner in managing your healthcare needs. We’re building
            the future of digital healthcare with a focus on accessibility,
            trust, and personalized care.
          </p>
          <p>
            With Prescripto, users can connect with licensed professionals,
            manage prescriptions, schedule appointments, and access health
            records securely from anywhere.
          </p>

          <div>
            <b className="text-gray-900 text-lg block mb-1">Our Vision</b>
            <p>
              To become a global leader in digital health solutions — making
              healthcare accessible and efficient for everyone, everywhere.
            </p>
          </div>

          <div>
            <b className="text-gray-900 text-lg block mb-1">Our Commitment</b>
            <p>
              We are committed to innovation, security, and patient
              satisfaction. Every feature we build is designed with your
              well-being in mind.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center">
        <p className="text-2xl font-semibold mb-8 text-gray-800">
          Why Choose <span className="text-primary">Prescripto?</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="px-6 py-8 border border-primary rounded-md shadow-md hover:bg-primary hover:text-white transition-all"
            >
              <b>{item.title}</b>
              <p className="mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Services */}
      <div>
        <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((service, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg mb-2 text-primary">
                {service.title}
              </h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          {[
            "Sign Up and Create Your Profile",
            "Browse Doctors and Book Appointments",
            "Consult Online or In-Person",
            "Access Records & Track Progress",
          ].map((step, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow-md hover:scale-[1.02] transition bg-white"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {index + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 p-8 rounded-md border border-gray-200 shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="border border-gray-300 p-5 rounded-md bg-white shadow-sm"
            >
              <p className="italic text-gray-700">“{testimonial.feedback}”</p>
              <p className="mt-3 font-semibold text-primary">
                — {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-3">
          Ready to Take Control of Your Health?
        </h2>
        <p className="mb-6 text-gray-600">
          Join thousands of users who trust Prescripto for their healthcare
          needs.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-primary text-white rounded-full hover:scale-105 transition cursor-pointer"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default About;
