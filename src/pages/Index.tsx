import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Sparkles, Brain, Clock, Zap, ArrowRight, Upload, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FA] via-[#F9FAFB] to-[#E6F0FA] overflow-hidden">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#A7C1A7]/30 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: -mousePosition.x,
              y: -mousePosition.y,
              scale: [1.2, 1, 1.2],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-20 right-20 w-[32rem] h-[32rem] bg-gradient-to-br from-[#6B7280]/20 to-transparent rounded-full blur-3xl"
          />

          {/* Floating Cards */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 right-[15%] w-32 h-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-[#E6F0FA] p-4"
          >
            <div className="w-full h-2 bg-[#E6F0FA] rounded mb-2" />
            <div className="w-3/4 h-2 bg-[#E6F0FA] rounded" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-40 left-[10%] w-36 h-24 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-[#E6F0FA] p-4"
          >
            <div className="w-full h-2 bg-[#A7C1A7]/30 rounded mb-2" />
            <div className="w-5/6 h-2 bg-[#A7C1A7]/30 rounded mb-2" />
            <div className="w-2/3 h-2 bg-[#A7C1A7]/30 rounded" />
          </motion.div>

          {/* Sparkle Effects */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
            >
              <Sparkles className="h-6 w-6 text-[#A7C1A7]/40" />
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-[#E6F0FA] mb-8"
          >
            <Zap className="h-4 w-4 text-[#A7C1A7]" />
            <span className="text-sm font-medium text-[#6B7280] font-['Open_Sans']">
              Didukung dengan AI untuk Belajar Lebih Cepat
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 font-['Lora']"
          >
            <span className="text-[#6B7280]">Ubah</span>
            <br />
            <span className="text-[#6B7280]">Catatanmu Jadi</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#A7C1A7] to-[#6B7280] bg-clip-text text-transparent">
                Flashcard
              </span>
              <motion.div
                animate={{
                  scaleX: [0, 1],
                }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-2 left-0 right-0 h-3 bg-[#A7C1A7]/20 -z-0"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-[#6B7280]/80 max-w-3xl mx-auto mb-12 leading-relaxed font-['Open_Sans']"
          >
            Belajar lebih efektif dengan flashcard otomatis dari AI.
            <span className="text-[#A7C1A7] font-semibold">
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
                  boxShadow: "0 20px 40px rgba(167, 193, 167, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#A7C1A7] to-[#A7C1A7]/90 hover:from-[#A7C1A7]/90 hover:to-[#A7C1A7] text-white px-10 py-7 rounded-2xl font-bold text-lg shadow-xl gap-3 group font-['Open_Sans']"
                >
                  <Upload className="h-5 w-5" />
                  {user ? "Ke Dashboard" : "Coba Sekarang — Gratis"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>

            {!user && (
              <Link to="/auth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm border-2 border-[#6B7280]/20 text-[#6B7280] px-10 py-7 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:border-[#A7C1A7] transition-all font-['Open_Sans']"
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
            className="flex flex-wrap items-center justify-center gap-8 text-[#6B7280]/60 text-sm font-['Open_Sans']"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#A7C1A7]" />
              <span>Gratis selamanya</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#A7C1A7]" />
              <span>User-friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#A7C1A7]" />
              <span>AI terbaru</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="0.3"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
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
            <h2 className="text-4xl md:text-5xl font-bold text-[#6B7280] mb-4 font-['Lora']">
              Kenapa Memilih REMORA?
            </h2>
            <p className="text-lg text-[#6B7280]/70 max-w-2xl mx-auto font-['Open_Sans']">
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
              className="bg-gradient-to-br from-[#E6F0FA] to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="bg-gradient-to-br from-[#A7C1A7] to-[#A7C1A7]/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#6B7280] font-['Lora']">
                AI-Powered
              </h3>
              <p className="text-[#6B7280]/70 leading-relaxed font-['Open_Sans']">
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
              className="bg-gradient-to-br from-[#E6F0FA] to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="bg-gradient-to-br from-[#6B7280] to-[#6B7280]/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#6B7280] font-['Lora']">
                Active Recall
              </h3>
              <p className="text-[#6B7280]/70 leading-relaxed font-['Open_Sans']">
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
              className="bg-gradient-to-br from-[#E6F0FA] to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="bg-gradient-to-br from-[#A7C1A7] to-[#6B7280] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#6B7280] font-['Lora']">
                Hemat Waktu
              </h3>
              <p className="text-[#6B7280]/70 leading-relaxed font-['Open_Sans']">
                Lupakan membuat flashcard manual. Fokus 100% pada belajar dan
                raih hasil maksimal dalam waktu singkat
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#E6F0FA] via-[#F9FAFB] to-[#E6F0FA] py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#6B7280] to-[#A7C1A7] rounded-[3rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <BookOpen className="h-20 w-20 mx-auto mb-6 text-white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Lora']">
                Siap Belajar Cepat dan Tepat?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-['Open_Sans']">
                Bergabung dengan ribuan pelajar yang sudah merasakan cara
                belajar yang lebih efektif dan menyenangkan
              </p>
              <Link to={user ? "/dashboard" : "/auth"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-white text-[#6B7280] hover:bg-white/90 px-12 py-7 rounded-2xl font-bold text-lg shadow-2xl gap-3 font-['Open_Sans']"
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