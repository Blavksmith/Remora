"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import {
  BookOpen,
  Sparkles,
  Brain,
  Clock,
  Zap,
  ArrowRight,
  Upload,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // console.log(container);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 overflow-hidden">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* tsparticles background */}
        <div className="absolute inset-0 -z-10">
          <Particles
            id="tsparticles-hero"
            init={particlesInit}
            options={{
              background: { color: { value: "transparent" } },
              fullScreen: { enable: false, zIndex: 0 },
              fpsLimit: 60,
              particles: {
                number: { value: 60, density: { enable: true, area: 800 } },
                color: { value: ["#10b981", "#34d399", "#0ea5a4"] },
                opacity: { value: 0.25 },
                size: { value: { min: 1, max: 3 } },
                links: {
                  enable: true,
                  color: "#10b981",
                  opacity: 0.15,
                  distance: 130,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: 1.2,
                  outModes: { default: "out" },
                },
              },
              interactivity: {
                events: {
                  onHover: { enable: true, mode: "repulse" },
                  resize: true,
                },
                modes: { repulse: { distance: 100, duration: 0.4 } },
              },
              detectRetina: true,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-emerald-100 mb-8"
          >
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Powered by AI • Belajar 3x Lebih Cepat
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6"
          >
            <span className="text-gray-800">Ubah</span>
            <br />
            <span className="text-gray-800">Catatanmu Jadi</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Flashcard AI
              </span>
              <motion.div
                animate={{
                  scaleX: [0, 1],
                  background: [
                    "linear-gradient(90deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))",
                    "linear-gradient(90deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))",
                  ],
                }}
                transition={{
                  scaleX: { duration: 0.8, delay: 1 },
                  background: {
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  },
                }}
                className="absolute bottom-2 left-0 right-0 h-4 -z-0"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Belajar lebih efektif dengan flashcard otomatis dari AI.
            <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              Upload catatan, dapatkan flashcard, mulai belajar
            </span>{" "}
            — semuanya dalam hitungan detik.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to={user ? "/dashboard" : "/upload"}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(139,92,246,0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-600 text-white px-10 py-7 rounded-2xl font-bold text-lg shadow-2xl gap-3 group"
                >
                  <Upload className="h-5 w-5" />
                  {user ? "Ke Dashboard" : "Coba Sekarang — Gratis"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>

            {!user && (
              <Link to="/auth">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/90 backdrop-blur-md border-2 border-emerald-200 text-gray-700 px-10 py-7 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:border-emerald-400 transition-all"
                  >
                    Login
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 text-gray-600 text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Gratis selamanya</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-600" />
              <span>User-friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>AI terbaru</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full"
          >
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(16,185,129,0.25)" />
                <stop offset="50%" stopColor="rgba(45,212,191,0.25)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.25)" />
              </linearGradient>
            </defs>
            <motion.path
              fill="url(#waveGradient)"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              animate={{
                d: [
                  "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                  "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-20 bg-white py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Kenapa Mulai Sekarang Kamu Harus Memilih Remora?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform belajar yang menggabungkan AI dengan metode pembelajaran
              terbukti efektif
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                AI-Powered
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Teknologi AI terbaru mengubah catatanmu menjadi flashcard
                berkualitas tinggi secara otomatis dalam hitungan detik
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="bg-gradient-to-br from-teal-600 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                Active Recall
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Metode belajar terbukti secara ilmiah untuk meningkatkan retensi
                memori hingga 3x lipat lebih efektif
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                Hemat Waktu
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lupakan membuat flashcard manual. Fokus 100% pada belajar dan
                raih hasil maksimal dalam waktu singkat
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-500 rounded-[3rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <BookOpen className="h-20 w-20 mx-auto mb-6 text-white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Siap Belajar Cepat dan Tepat?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Bergabung dengan ribuan pelajar yang sudah merasakan cara
                belajar yang lebih efektif dan menyenangkan
              </p>
              <Link to={user ? "/dashboard" : "/auth"}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-white/90 px-12 py-7 rounded-2xl font-bold text-lg shadow-2xl gap-3"
                  >
                    {user ? "Buka Dashboard" : "Mulai Sekarang — Gratis"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
