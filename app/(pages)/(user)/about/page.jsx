"use client";
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { 
  ShieldCheck, 
  Clock, 
  MousePointerClick, 
  Headphones, 
  Video, 
  FileText, 
  Database, 
  CalendarCheck, 
  Bell, 
  MessageSquare,
  Quote
} from "lucide-react";

const About = () => {
  const { router } = useAppContext();

  const services = [
    {
      title: "efficiency",
      desc: "Streamlined scheduling, real-time updates, and optimized health record management.",
      icon: <Clock className="text-primary" size={24} />,
    },
    {
      title: "convenience",
      desc: "Access healthcare from anywhere, anytime — no queues, no waiting rooms.",
      icon: <MousePointerClick className="text-primary" size={24} />,
    },
    {
      title: "safety",
      desc: "Data security, verified professionals, and protected user privacy at every step.",
      icon: <ShieldCheck className="text-primary" size={24} />,
    },
    {
      title: "support",
      desc: "24/7 support to guide, assist, and empower your healthcare experience.",
      icon: <Headphones className="text-primary" size={24} />,
    },
  ];

  const offers = [
    { title: "online consultation", desc: "Consult licensed doctors via video call securely.", icon: <Video size={20} /> },
    { title: "digital prescriptions", desc: "Receive and share your prescriptions digitally.", icon: <FileText size={20} /> },
    { title: "health records", desc: "All your medical history stored safely in one place.", icon: <Database size={20} /> },
    { title: "easy scheduling", desc: "Book, reschedule, or cancel with just a few clicks.", icon: <CalendarCheck size={20} /> },
    { title: "smart reminders", desc: "Automatic reminders for prescriptions and checkups.", icon: <Bell size={20} /> },
    { title: "secure messaging", desc: "Encrypted chat with healthcare professionals.", icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="flex flex-col gap-24 py-12">
      
      {/* 1. Hero Header */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            About <span className="text-primary">us</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            We are on a mission to bridge the gap between patients and quality healthcare 
            through innovative technology and compassionate care.
          </p>
        </div>
      </section>

      {/* 2. Intro Section */}
      <section className="px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl scale-95 group-hover:scale-100 transition-transform duration-500" />
          <Image
            src={assets.about_image}
            width={600}
            height={600}
            alt="medical professionals"
            className="relative rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:-rotate-1"
          />
        </div>

        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">our story</h2>
            <p className="text-slate-600 leading-relaxed">
              Welcome to <span className="font-semibold text-primary">prescripto</span>, your 
              trusted partner in healthcare. We started with a simple idea: that booking a 
              doctor should be as easy as booking a ride.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Today, we connect thousands of patients with verified specialists, 
              ensuring that quality medical advice is just a click away.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <h3 className="font-bold text-slate-900 mb-2">our vision</h3>
              <p className="text-sm text-slate-600">To lead the global transition toward accessible digital health solutions.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">our commitment</h3>
              <p className="text-sm text-slate-600">Innovation, security, and patient-first care in every feature we build.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us (Icon Cards) */}
      <section className="px-6 md:px-12 lg:px-20 bg-slate-50 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">why choose <span className="text-primary">prescripto?</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, idx) => (
            <div key={idx} className="group p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">what we offer</h2>
            <p className="text-slate-500 mt-2">comprehensive digital tools for your health journey.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((service, idx) => (
            <div key={idx} className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all group">
              <div className="mt-1 text-primary group-hover:scale-110 transition-transform">{service.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{service.title}</h3>
                <p className="text-sm text-slate-500">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How it Works (Timeline Style) */}
      <section className="px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl font-bold text-center mb-16">how it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            "create your profile",
            "browse & book",
            "consult with experts",
            "track your progress",
          ].map((step, index) => (
            <div key={index} className="relative text-center md:text-left">
              <span className="text-6xl font-black text-slate-100 absolute -top-10 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 z-0">0{index + 1}</span>
              <div className="relative z-10 pt-4">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{step}</h3>
                <p className="text-sm text-slate-500">follow our simple process to get the care you need instantly.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="bg-primary rounded-3xl p-8 md:p-16 flex flex-col items-center">
          <Quote className="text-white/20 mb-6" size={48} />
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">what our users say</h2>
          <div className="grid md:grid-cols-3 gap-8 w-full">
            {[
              { name: "anjali sharma", text: "prescripto made it easy to get help for my chronic condition without hassle." },
              { name: "ravi thapa", text: "excellent ui, smooth experience. booking an appointment takes seconds!" },
              { name: "sita gurung", text: "i love that i can access all my medical history in one place. very helpful." }
            ].map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <p className="text-white/90 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <p className="text-white font-bold text-xs">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="px-6 md:px-12 lg:px-20 text-center pb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to take control of your health?</h2>
        <p className="text-slate-500 mb-10 max-w-xl mx-auto text-lg">
          join thousands of users who trust prescripto for their healthcare needs.
        </p>
        <button
          onClick={() => { router.push("/login"); window.scrollTo(0,0); }}
          className="px-10 py-4 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          get started now
        </button>
      </section>
    </div>
  );
};

export default About;