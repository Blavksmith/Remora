import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  RotateCcw,
  Check,
  X,
  Eye,
  Home,
  Trophy,
  Sparkles,
} from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const Quiz = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [setTitle, setSetTitle] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchFlashcards();
    }
  }, [user, id]);

  const fetchFlashcards = async () => {
    try {
      const { data: setData, error: setError } = await supabase
        .from("flashcard_sets")
        .select("title")
        .eq("id", id)
        .single();

      if (setError) throw setError;
      setSetTitle(setData.title);

      const { data, error } = await supabase
        .from("flashcards")
        .select("id, question, answer")
        .eq("set_id", id);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "Info",
          description: "Tidak ada flashcard dalam set ini",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setFlashcards(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoadingData(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }

    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setShowAnswer(false);
        setIsFlipped(false);
      }, 300);
    } else {
      setIsComplete(true);
      saveQuizResult(correct);
    }
  };

  const saveQuizResult = async (lastCorrect: boolean) => {
    try {
      await supabase.from("quiz_results").insert({
        user_id: user?.id,
        set_id: id,
        correct_count: correctCount + (lastCorrect ? 1 : 0),
        total_count: flashcards.length,
      });
    } catch (error: any) {
      console.error("Error saving quiz result:", error);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setShowAnswer(false);
    setIsFlipped(false);
    setIsComplete(false);
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
            <p className="text-gray-700 font-medium">Memuat kuis...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;
  const percentageCorrect = isComplete
    ? Math.round((correctCount / flashcards.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <Navbar user={user} />

      <main className="container py-8 px-4 max-w-4xl mx-auto">
        {!isComplete ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {setTitle}
                </h1>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600">
                    Kartu {currentIndex + 1} dari {flashcards.length}
                  </p>
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <span className="text-sm font-semibold text-gray-800">
                      {correctCount} Benar
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2 bg-emerald-100" />
              </motion.div>
            </div>

            {/* Flashcard */}
            {/* Flashcard */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                {!showAnswer ? (
                  // Front card (Question)
                  <Card className="min-h-[400px] flex flex-col items-center justify-center p-8 border-0 shadow-2xl rounded-3xl bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-teal-100/50 to-transparent rounded-full -ml-32 -mb-32" />

                    <CardContent className="text-center space-y-8 relative z-10">
                      <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">
                          Pertanyaan
                        </span>
                      </div>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed px-4"
                      >
                        {currentCard.question}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button
                          onClick={handleFlip}
                          size="lg"
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl rounded-2xl px-8 py-6 font-semibold gap-2"
                        >
                          <Eye className="h-5 w-5" />
                          Tampilkan Jawaban
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                ) : (
                  // Back card (Answer)
                  <Card className="min-h-[400px] flex flex-col items-center justify-center p-8 border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />

                    <CardContent className="text-center space-y-8 relative z-10 w-full">
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-semibold text-white leading-relaxed px-4 mb-8"
                      >
                        {currentCard.answer}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-lg mx-auto"
                      >
                        <Button
                          onClick={() => handleAnswer(false)}
                          size="lg"
                          className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 rounded-2xl px-8 py-6 font-semibold gap-2 flex-1"
                        >
                          <X className="h-5 w-5" />
                          Belum Paham
                        </Button>
                        <Button
                          onClick={() => handleAnswer(true)}
                          size="lg"
                          className="bg-white text-emerald-700 hover:bg-white/90 shadow-2xl rounded-2xl px-8 py-6 font-semibold gap-2 flex-1"
                        >
                          <Check className="h-5 w-5" />
                          Sudah Paham
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-gray-500">
                Jawab pertanyaan, lalu klik "Tampilkan Jawaban" kemudian pilih apakah kamu sudah paham atau belum.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="p-8 md:p-12 border-0 shadow-2xl rounded-3xl bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-100/50 to-transparent rounded-full -ml-48 -mb-48" />

              <CardContent className="space-y-8 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-gray-800"
                >
                  Kuis Selesai!
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100"
                >
                  <div className="mb-4">
                    <p className="text-7xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {percentageCorrect}%
                    </p>
                  </div>
                  <p className="text-xl text-gray-700">
                    {correctCount} benar dari {flashcards.length} pertanyaan
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    {percentageCorrect >= 80 ? (
                      <>
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-gray-800">
                          Luar biasa! Pertahankan!
                        </span>
                      </>
                    ) : percentageCorrect >= 60 ? (
                      <>
                        <Trophy className="h-4 w-4 text-teal-600" />
                        <span className="text-sm font-semibold text-gray-800">
                          Bagus! Terus berlatih!
                        </span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-800">
                          Coba lagi untuk hasil lebih baik!
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                >
                  <Button
                    onClick={resetQuiz}
                    size="lg"
                    className="bg-white border-2 border-emerald-200 text-gray-700 hover:bg-emerald-50 shadow-lg rounded-2xl px-8 py-6 font-semibold gap-2"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Ulangi Kuis
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl rounded-2xl px-8 py-6 font-semibold gap-2"
                  >
                    <Home className="h-5 w-5" />
                    Ke Dashboard
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Quiz;
