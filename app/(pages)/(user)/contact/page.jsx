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
  Send,
  ExternalLink
} from "lucide-react";

const Contact = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12 space-y-24">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Get In <span className="text-primary">Touch</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl font-light leading-relaxed">
          Have questions or need assistance? Our team is here to help you with appointments, 
          technical support, or career opportunities.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Side - Info & Image */}
        <div className="lg:col-span-5 space-y-12">
          <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src={assets.contact_image}
              alt="Prescripto Medical Office"
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            {/* Office Info */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">Our Office</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  54709 Williams Station<br />
                  Suite 350, Washington, USA
                </p>
              </div>
            </div>

            {/* Reach Us Info */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">Reach Us</h3>
                <p className="mt-2 text-slate-600">
                  <span className="font-medium text-slate-900">Phone:</span> (241) 968-025<br />
                  <span className="font-medium text-slate-900">Email:</span> support@prescripto.com
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">Business Hours</h3>
                <p className="mt-2 text-slate-600">
                  Monday – Friday: 9:00 AM – 6:00 PM<br />
                  Saturday: 10:00 AM – 2:00 PM
                </p>
              </div>
            </div>

            {/* Careers Section */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col items-start gap-4 hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Briefcase size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Careers at Prescripto</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                We are always looking for talented healthcare professionals and innovators to join our medical team.
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
                Explore Job Openings <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Modern Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-50">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Send Us A Message</h2>
            <p className="text-slate-500 mt-3 font-light">Fill out the form below and our team will respond within 24 hours.</p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all duration-300 placeholder:text-slate-300"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all duration-300 placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
              <input
                type="text"
                placeholder="Appointment Inquiry"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all duration-300 placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
              <textarea
                rows={5}
                placeholder="How can we help you today?"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all duration-300 resize-none placeholder:text-slate-300"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white px-12 py-5 rounded-full font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Submit Message</span>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <section className="pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Visit Our Location</h2>
            <p className="text-slate-500 font-light mt-1 text-lg">Find us in the heart of the medical district.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-primary font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <span>Open in Google Maps</span>
            <ExternalLink size={16} />
          </button>
        </div>
        
        <div className="w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.0028165876674!2d85.3362288751469!3d27.68630782641969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1994769ac19f%3A0xd15dddabb04dbed!2sCivil%20Service%20Hospital%20of%20Nepal!5e0!3m2!1sen!2snp!4v1754228218486!5m2!1sen!2snp"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(0.1) contrast(1.05)' }}
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