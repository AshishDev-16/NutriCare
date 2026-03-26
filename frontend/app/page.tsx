"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Shield, Users, Clock, CheckCircle2 } from 'lucide-react'
import { useRef } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#f8f9ff] text-[#0d1c2e] selection:bg-[#10b981]/30">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 px-4 lg:px-8 h-20 flex items-center justify-between backdrop-blur-xl bg-[#f8f9ff]/80 border-b border-[#bec9c2]/20">
        <Link className="flex items-center gap-2 group" href="/">
          <div className="w-10 h-10 bg-gradient-to-br from-[#004532] to-[#065f46] rounded-xl flex items-center justify-center shadow-lg shadow-[#065f46]/20 group-hover:scale-110 transition-transform">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#004532]">VitalFlow</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-[#065f46] transition-colors hidden md:block">Features</Link>
          <Link href="#impact" className="text-sm font-medium hover:text-[#065f46] transition-colors hidden md:block">Impact</Link>
          <Link 
            className="inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-br from-[#004532] to-[#065f46] hover:shadow-xl hover:shadow-[#065f46]/30 transition-all h-11 px-8 rounded-xl" 
            href={isAuthenticated ? (user?.role === 'manager' ? '/manager' : '/pantry') : '/login'}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Staff Portal'}
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-32 lg:pb-48">
          <motion.div 
            style={{ opacity, scale }}
            className="container px-4 md:px-6 relative z-10 mx-auto"
          >
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#065f46]/10 text-[#065f46] text-sm font-bold border border-[#065f46]/20"
              >
                <Shield className="w-4 h-4" />
                Trusted by 50+ Leading Hospitals
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none text-[#004532]"
              >
                Precision Nutrition for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#059669]">Modern Care</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-[800px] text-[#3f4944] md:text-xl lg:text-2xl leading-relaxed"
              >
                Revolutionizing hospital food management through data-driven clinical nutrition and seamless operational orchestration.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href={isAuthenticated ? (user?.role === 'manager' ? '/manager' : '/pantry') : '/login'}>
                  <Button size="lg" className="h-14 px-10 rounded-2xl bg-[#004532] hover:bg-[#065f46] text-white font-bold text-lg shadow-2xl shadow-[#065f46]/20 transition-all hover:scale-105">
                    {isAuthenticated ? 'Back to Command Center' : 'Launch Command Center'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-2 border-[#bec9c2] text-[#3f4944] font-bold text-lg hover:bg-[#eff4ff] transition-all">
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-[#004532]/5 rounded-full blur-[100px] pointer-events-none" />
        </section>

        {/* 3D Visual Section Placeholder / Visual Hook */}
        <section className="py-12 bg-white relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full aspect-[21/9] rounded-[32px] bg-gradient-to-br from-[#004532] to-[#10b981] relative overflow-hidden shadow-2xl"
            >
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Integrated Clinical Intelligence</h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">Connecting doctors, dieticians, and kitchen staff in one unified ecosystem.</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-24 lg:py-48 bg-[#f8f9ff]">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-[#004532]">Operational Excellence</h2>
              <p className="text-[#3f4944] text-lg">Every module is designed for accuracy, speed, and patient safety.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  icon: <Activity className="w-8 h-8" />, 
                  title: "Smart Dietary Management", 
                  desc: "Automated diet chart generation based on patient clinical parameters and dietary restrictions." 
                },
                { 
                  icon: <Users className="w-8 h-8" />, 
                  title: "Real-time Coordination", 
                  desc: "Instant communication between nursing staff, pantry managers, and kitchen personnel." 
                },
                { 
                  icon: <Clock className="w-8 h-8" />, 
                  title: "Delivery Orchestration", 
                  desc: "Monitor meal progress from preparation to patient delivery with precise tracking." 
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-10 rounded-[32px] bg-white border border-[#bec9c2]/20 hover:border-[#10b981]/50 hover:shadow-2xl hover:shadow-[#10b981]/10 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] text-[#065f46] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#065f46] group-hover:text-white transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#0d1c2e]">{feature.title}</h3>
                  <p className="text-[#3f4944] leading-relaxed italic">"{feature.desc}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust/Impact Section */}
        <section id="impact" className="py-24 bg-[#004532] text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Centered on Patient Recovery</h2>
                <div className="space-y-6">
                  {[
                    "98.4% Accuracy in Dietary Compliance",
                    "30% Reduction in Food Waste",
                    "Real-time Allergy & Restriction Monitoring",
                    "Seamless Staff Handover Systems"
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 text-emerald-100/90 text-lg"
                    >
                      <CheckCircle2 className="text-[#10b981] w-6 h-6 flex-shrink-0" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                 <div className="aspect-square rounded-[48px] bg-emerald-900/50 backdrop-blur-2xl border border-white/10 p-12 flex flex-col justify-center gap-8">
                    <div className="text-6xl font-black text-[#10b981]">4.2M+</div>
                    <p className="text-2xl text-emerald-50/80 leading-relaxed font-medium italic">
                      "Meals precisely delivered to patients across the nation with zero clinical errors."
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-emerald-500/20" />
                       <div>
                          <div className="font-bold">Dr. Sarah Thompson</div>
                          <div className="text-sm text-emerald-200/60">Chief Medical Officer, City General</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-[#bec9c2]/20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Activity className="text-[#065f46] w-6 h-6" />
              <span className="font-bold text-xl text-[#004532]">VitalFlow</span>
            </div>
            <p className="text-sm text-[#3f4944]">© 2024 Institutional Medical Solutions. ISO 27001 Certified.</p>
            <nav className="flex gap-8">
              <Link className="text-sm font-semibold hover:text-[#065f46] transition-colors" href="#">Security</Link>
              <Link className="text-sm font-semibold hover:text-[#065f46] transition-colors" href="#">Compliance</Link>
              <Link className="text-sm font-semibold hover:text-[#065f46] transition-colors" href="#">Support</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}


