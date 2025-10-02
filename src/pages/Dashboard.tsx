import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Plus, BookOpen, Trophy, TrendingUp, Clock, Sparkles, Zap } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
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
              className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-700 font-medium">Memuat dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <Navbar user={user} />
      
      <main className="container py-8 px-4 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Banner */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 p-8 md:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
              
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <Zap className="h-6 w-6 text-white animate-pulse" />
                    <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                      Selamat Datang Kembali
                    </span>
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                    Dashboard Belajarmu
                  </h1>
                  <p className="text-white/90 text-lg max-w-xl leading-relaxed">
                    Kelola flashcard dan pantau progressmu dengan mudah. Terus berkembang setiap hari!
                  </p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => navigate("/upload")} 
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-white/90 shadow-2xl gap-3 px-8 py-6 rounded-2xl font-semibold"
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
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all rounded-2xl bg-white group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700">
                    Total Flashcard Sets
                  </CardTitle>
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {stats.totalSets}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <TrendingUp className="h-4 w-4" />
                    <span>Terus bertambah</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all rounded-2xl bg-white group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700">
                    Total Kartu
                  </CardTitle>
                  <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl group-hover:from-teal-100 group-hover:to-emerald-100 transition-colors">
                    <Trophy className="h-5 w-5 text-teal-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {stats.totalCards}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>Materi belajar</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3 - Featured */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
                <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                  <CardTitle className="text-sm font-semibold text-white">
                    Aktivitas Terakhir
                  </CardTitle>
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-bold text-white mb-2">
                    Hari ini
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
                    <Sparkles className="h-4 w-4" />
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
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Flashcard Sets-mu
                </h2>
                <p className="text-gray-600">
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
                <Card className="text-center py-16 border-0 shadow-xl rounded-3xl bg-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50" />
                  <CardContent className="relative z-10">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BookOpen className="h-20 w-20 mx-auto mb-6 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Belum ada flashcard
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                      Mulai perjalanan belajarmu dengan membuat flashcard pertama dari catatanmu!
                    </p>
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={() => navigate("/upload")}
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl rounded-2xl px-8 py-6 font-semibold"
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
                      className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer rounded-2xl bg-white overflow-hidden group relative"
                      onClick={() => navigate(`/quiz/${set.id}`)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500" />
                      
                      <CardHeader className="relative z-10 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
                            <BookOpen className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {new Date(set.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <CardTitle className="text-xl text-gray-800 leading-tight line-clamp-2 font-bold">
                          {set.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 flex items-center gap-2 mt-2">
                          <Trophy className="h-4 w-4 text-emerald-600" />
                          {set.flashcards?.[0]?.count || 0} kartu tersedia
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <Button 
                          variant="outline" 
                          className="w-full bg-transparent border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold rounded-xl py-5 transition-all shadow-sm hover:shadow-lg group-hover:border-emerald-600"
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