"use client";
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Briefcase, 
  Send 
} from "lucide-react";

const Contact = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12 space-y-24">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Contact <span className="text-primary">us</span>
        </h1>
        <div className="h-1 w-12 bg-primary mx-auto mt-4 rounded-full opacity-20" />
        <p className="mt-6 text-slate-500 text-lg">
          We’d love to hear from you! Get in touch with our team for appointments, support, or career inquiries.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Side - Info & Image */}
        <div className="lg:col-span-5 space-y-10">
          <div className="relative group overflow-hidden rounded-3xl">
            <Image
              src={assets.contact_image}
              alt="medical office"
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {/* Office Info */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">our office</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  54709 Wilims Station<br />
                  Suite 350, Washington, USA
                </p>
              </div>
            </div>

            {/* Reach Us Info */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">reach us</h3>
                <p className="mt-2 text-sm text-slate-500">
                  phone: (241) 968-025<br />
                  email: naveenshah.dev@gmail.com
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">business hours</h3>
                <p className="mt-2 text-sm text-slate-500">
                  mon–fri: 9:00 am – 6:00 pm<br />
                  sat: 10:00 am – 2:00 pm
                </p>
              </div>
            </div>

            {/* Careers */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-primary" />
                <h3 className="font-bold text-slate-900">careers</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                we're always looking for talented people to join our medical team.
              </p>
              <button className="text-sm font-bold text-primary hover:underline transition-all">
                explore jobs →
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Modern Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-100 border border-slate-50">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">send us a message</h2>
            <p className="text-slate-500 text-sm mt-2">fill out the form below and we'll get back to you within 24 hours.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">full name</label>
                <input
                  type="text"
                  placeholder="john doe"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">email address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">subject</label>
              <input
                type="text"
                placeholder="appointment inquiry"
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">message</label>
              <textarea
                rows={5}
                placeholder="how can we help you?"
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>submit message</span>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">visit our location</h2>
            <p className="text-slate-500 text-sm">find us in the heart of the city.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-primary font-bold text-sm">
            <span>open maps</span>
            <MapPin size={16} />
          </div>
        </div>
        <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.0028165876674!2d85.3362288751469!3d27.68630782641969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1994769ac19f%3A0xd15dddabb04dbed!2sCivil%20Service%20Hospital%20of%20Nepal!5e0!3m2!1sen!2snp!4v1754228218486!5m2!1sen!2snp"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;