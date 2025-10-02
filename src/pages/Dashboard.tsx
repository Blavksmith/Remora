import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Plus, BookOpen, Trophy, TrendingUp, Clock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlashcardSet {
  id: string;
  title: string;
  created_at: string;
  flashcards: { count: number }[];
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [stats, setStats] = useState({ totalSets: 0, totalCards: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFlashcardSets();
    }
  }, [user]);

  const fetchFlashcardSets = async () => {
    try {
      const { data, error } = await supabase
        .from("flashcard_sets")
        .select(`
          id,
          title,
          created_at,
          flashcards (count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setFlashcardSets(data || []);
      
      const totalCards = data?.reduce((acc, set) => {
        const count = set.flashcards?.[0]?.count || 0;
        return acc + count;
      }, 0) || 0;

      setStats({
        totalSets: data?.length || 0,
        totalCards: totalCards,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E6F0FA] via-[#F9FAFB] to-[#E6F0FA]">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#A7C1A7] border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-[#6B7280] font-['Open_Sans']">Memuat dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FA] via-[#F9FAFB] to-[#E6F0FA]">
      <Navbar user={user} />
      
      <main className="container py-8 px-4 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6B7280] to-[#A7C1A7] p-8 md:p-12 shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                    <span className="text-white/90 font-['Open_Sans'] text-sm uppercase tracking-wider">
                      Selamat Datang Kembali
                    </span>
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-['Lora'] font-bold text-white mb-3 leading-tight">
                    Dashboard Belajarmu
                  </h1>
                  <p className="text-white/80 font-['Open_Sans'] text-lg max-w-xl leading-relaxed">
                    Kelola flashcard dan pantau progressmu dengan mudah. Terus berkembang setiap hari!
                  </p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => navigate("/upload")} 
                    size="lg"
                    className="bg-white text-[#6B7280] hover:bg-white/90 shadow-xl gap-3 px-8 py-6 rounded-xl font-['Open_Sans'] font-semibold"
                  >
                    <Plus className="h-5 w-5" />
                    Buat Flashcard Baru
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all rounded-2xl bg-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A7C1A7]/20 to-transparent rounded-full -mr-16 -mt-16" />
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-['Open_Sans'] font-medium text-[#6B7280]">
                    Total Flashcard Sets
                  </CardTitle>
                  <div className="p-3 bg-[#E6F0FA] rounded-xl">
                    <BookOpen className="h-5 w-5 text-[#6B7280]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-['Lora'] font-bold text-[#6B7280] mb-2">
                    {stats.totalSets}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#A7C1A7] font-['Open_Sans']">
                    <TrendingUp className="h-4 w-4" />
                    <span>Terus bertambah</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all rounded-2xl bg-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A7C1A7]/20 to-transparent rounded-full -mr-16 -mt-16" />
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-['Open_Sans'] font-medium text-[#6B7280]">
                    Total Kartu
                  </CardTitle>
                  <div className="p-3 bg-[#E6F0FA] rounded-xl">
                    <Trophy className="h-5 w-5 text-[#6B7280]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-['Lora'] font-bold text-[#6B7280] mb-2">
                    {stats.totalCards}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#A7C1A7] font-['Open_Sans']">
                    <Sparkles className="h-4 w-4" />
                    <span>Materi belajar</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all rounded-2xl bg-gradient-to-br from-[#A7C1A7] to-[#A7C1A7]/80">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-['Open_Sans'] font-medium text-white">
                    Aktivitas Terakhir
                  </CardTitle>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-['Lora'] font-bold text-white mb-2">
                    Hari ini
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90 font-['Open_Sans']">
                    <TrendingUp className="h-4 w-4" />
                    <span>Tetap semangat!</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Flashcard Sets Grid */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-['Lora'] font-semibold text-[#6B7280] mb-2">
                  Flashcard Sets-mu
                </h2>
                <p className="text-[#6B7280]/70 font-['Open_Sans']">
                  Pilih set untuk memulai latihan
                </p>
              </div>
            </div>
            
            {flashcardSets.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                <Card className="text-center py-16 border-0 shadow-lg rounded-3xl bg-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E6F0FA]/50 to-transparent" />
                  <CardContent className="relative z-10">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BookOpen className="h-20 w-20 mx-auto mb-6 text-[#A7C1A7]" />
                    </motion.div>
                    <h3 className="text-2xl font-['Lora'] font-bold text-[#6B7280] mb-3">
                      Belum ada flashcard
                    </h3>
                    <p className="text-[#6B7280]/70 font-['Open_Sans'] mb-8 max-w-md mx-auto leading-relaxed">
                      Mulai perjalanan belajarmu dengan membuat flashcard pertama dari catatanmu!
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => navigate("/upload")}
                        size="lg"
                        className="bg-[#A7C1A7] hover:bg-[#A7C1A7]/90 text-white shadow-lg rounded-xl px-8 py-6 font-['Open_Sans'] font-semibold"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Buat Flashcard Pertama
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcardSets.map((set, index) => (
                  <motion.div
                    key={set.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card 
                      className="border-0 shadow-md hover:shadow-2xl transition-all cursor-pointer rounded-2xl bg-white overflow-hidden group relative"
                      onClick={() => navigate(`/quiz/${set.id}`)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#A7C1A7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 right-4 w-16 h-16 bg-[#E6F0FA] rounded-full opacity-50 group-hover:scale-150 transition-transform" />
                      
                      <CardHeader className="relative z-10 pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 bg-[#E6F0FA] rounded-xl group-hover:bg-[#A7C1A7] transition-colors">
                            <BookOpen className="h-5 w-5 text-[#6B7280] group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-xs font-['Open_Sans'] text-[#6B7280]/60 bg-[#F9FAFB] px-3 py-1 rounded-full">
                            {new Date(set.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <CardTitle className="font-['Lora'] text-xl text-[#6B7280] leading-tight line-clamp-2">
                          {set.title}
                        </CardTitle>
                        <CardDescription className="font-['Open_Sans'] text-[#6B7280]/60 flex items-center gap-2 mt-2">
                          <Trophy className="h-4 w-4" />
                          {set.flashcards?.[0]?.count || 0} kartu tersedia
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <Button 
                          variant="outline" 
                          className="w-full bg-transparent border-2 border-[#A7C1A7] text-[#A7C1A7] hover:bg-[#A7C1A7] hover:text-white font-['Open_Sans'] font-semibold rounded-xl py-5 transition-all group-hover:border-[#A7C1A7] group-hover:shadow-lg"
                        >
                          Mulai Kuis
                          <motion.span
                            className="ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;