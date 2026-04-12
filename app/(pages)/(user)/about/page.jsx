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
  Quote,
  ArrowRight
} from "lucide-react";

const About = () => {
  const { router } = useAppContext();

  const services = [
    {
      title: "Efficiency",
      desc: "Streamlined scheduling, real-time updates, and optimized health record management for a faster experience.",
      icon: <Clock className="text-primary group-hover:text-white" size={24} />,
    },
    {
      title: "Convenience",
      desc: "Access premium healthcare from anywhere, anytime — no more long queues or crowded waiting rooms.",
      icon: <MousePointerClick className="text-primary group-hover:text-white" size={24} />,
    },
    {
      title: "Safety",
      desc: "Bank-grade data security, verified medical professionals, and protected user privacy at every step.",
      icon: <ShieldCheck className="text-primary group-hover:text-white" size={24} />,
    },
    {
      title: "Support",
      desc: "Dedicated 24/7 support team to guide, assist, and empower your digital healthcare journey.",
      icon: <Headphones className="text-primary group-hover:text-white" size={24} />,
    },
  ];

  const offers = [
    { title: "Online Consultation", desc: "Consult licensed doctors via secure high-definition video calls.", icon: <Video size={20} /> },
    { title: "Digital Prescriptions", desc: "Receive and manage your prescriptions digitally for easy pharmacy access.", icon: <FileText size={20} /> },
    { title: "Health Records", desc: "Your entire medical history stored safely and accessible in one central hub.", icon: <Database size={20} /> },
    { title: "Easy Scheduling", desc: "Book, reschedule, or cancel your appointments with just a few simple clicks.", icon: <CalendarCheck size={20} /> },
    { title: "Smart Reminders", desc: "Receive automatic notifications for upcoming checkups and prescription refills.", icon: <Bell size={20} /> },
    { title: "Secure Messaging", desc: "Direct, encrypted chat with your healthcare providers for quick follow-ups.", icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="flex flex-col gap-24 py-16 transition-all duration-500">
      
      {/* 1. Hero Header */}
      <section className="px-6 md:px-12 lg:px-20 text-center md:text-left">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed font-light">
            We are on a mission to bridge the gap between patients and quality healthcare 
            through innovative technology and compassionate, patient-centered care.
          </p>
        </div>
      </section>

      {/* 2. Intro Section */}
      <section className="px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
          <Image
            src={assets.about_image}
            width={600}
            height={600}
            alt="Medical Professionals"
            className="relative rounded-2xl object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-col gap-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 capitalize">Our Story</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Welcome to <span className="font-bold text-primary">Prescripto</span>, your 
              trusted partner in modern healthcare. We started with a simple vision: 
              that accessing a doctor should be as intuitive and effortless as any other digital service.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Today, we proudly connect thousands of patients with verified specialists, 
              ensuring that quality medical advice and care are always just a click away.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-white hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">To lead the global transition toward accessible, equitable, and efficient digital health solutions.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">Our Commitment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Continuous innovation, absolute security, and a patient-first approach in every feature we build.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us (Icon Cards) */}
      <section className="px-6 md:px-12 lg:px-20 bg-slate-50/80 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose <span className="text-primary">Prescripto?</span></h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">We combine medical expertise with technical excellence to provide a seamless healthcare experience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, idx) => (
            <div key={idx} className="group p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-primary/10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">What We Offer</h2>
          <p className="text-slate-500 mt-2 text-lg font-light">Comprehensive digital tools designed for your unique health journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((service, idx) => (
            <div key={idx} className="flex gap-5 p-7 rounded-2xl border border-slate-100 hover:border-primary/30 hover:bg-primary/[0.02] transition-all group cursor-default">
              <div className="mt-1 p-3 rounded-lg bg-slate-50 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {service.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How it Works (Timeline Style) */}
      <section className="px-6 md:px-12 lg:px-20 py-10">
        <h2 className="text-3xl font-bold text-center mb-20 text-slate-900">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { title: "Create Your Profile", desc: "Sign up and complete your health profile securely." },
            { title: "Browse & Book", desc: "Find the right specialist and select a convenient time." },
            { title: "Consult With Experts", desc: "Meet your doctor via our encrypted video platform." },
            { title: "Track Your Progress", desc: "Access your history and follow-up on your care plan." },
          ].map((step, index) => (
            <div key={index} className="relative text-center md:text-left group">
              <span className="text-8xl font-black text-slate-100 absolute -top-12 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 z-0 select-none group-hover:text-primary/5 transition-colors">0{index + 1}</span>
              <div className="relative z-10">
                <h3 className="font-bold text-slate-900 text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="bg-primary rounded-[3rem] p-10 md:p-20 flex flex-col items-center shadow-2xl shadow-primary/20 relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          
          <Quote className="text-white/20 mb-8" size={64} fill="currentColor" />
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16 tracking-tight">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-3 gap-10 w-full relative z-10">
            {[
              { name: "Anjali Sharma", text: "Prescripto made it incredibly easy to get help for my chronic condition without the usual hassle of clinic wait times." },
              { name: "Ravi Thapa", text: "Excellent user interface and a very smooth experience. Booking a specialist appointment now literally takes seconds!" },
              { name: "Sita Gurung", text: "I love that I can access my entire medical history and prescriptions in one place. It is a game changer for busy parents." }
            ].map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors">
                <p className="text-white/90 text-md leading-relaxed mb-6 italic font-light">"{t.text}"</p>
                <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold text-white/70">
                   <div className="w-4 h-[1px] bg-white/50" /> {t.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="px-6 md:px-12 lg:px-20 text-center pb-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Ready to take control of your health?</h2>
        <p className="text-slate-500 mb-12 max-w-2xl mx-auto text-lg md:text-xl font-light">
          Join thousands of users who trust Prescripto for their daily healthcare needs and expert medical advice.
        </p>
        <button
          onClick={() => { router.push("/login"); window.scrollTo(0,0); }}
          className="group flex items-center gap-3 mx-auto px-10 py-5 bg-primary text-white font-bold rounded-full shadow-2xl shadow-primary/30 hover:scale-105 hover:bg-primary/90 transition-all active:scale-95"
        >
          Get Started Now
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </section>
    </div>
  );
};

export default About;