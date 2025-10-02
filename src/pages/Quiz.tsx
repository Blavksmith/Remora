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
import { ChevronRight, RotateCcw, Check, X } from "lucide-react";

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

      // Get flashcards
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

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // Quiz complete
      setIsComplete(true);
      saveQuizResult();
    }
  };

  const saveQuizResult = async () => {
    try {
      await supabase.from("quiz_results").insert({
        user_id: user?.id,
        set_id: id,
        correct_count: correctCount + 1, // +1 for current answer
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
    setIsComplete(false);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="container py-8 px-4">
        {!isComplete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-serif font-bold mb-2">{setTitle}</h1>
              <p className="text-muted-foreground mb-4">
                Kartu {currentIndex + 1} dari {flashcards.length}
              </p>
              <Progress value={progress} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6 min-h-[300px] flex items-center justify-center p-8">
                  <CardContent className="text-center space-y-6">
                    <div>
                      <p className="text-sm text-accent mb-2">
                        {showAnswer ? "Jawaban" : "Pertanyaan"}
                      </p>
                      <p className="text-2xl font-serif">
                        {showAnswer ? currentCard.answer : currentCard.question}
                      </p>
                    </div>

                    {!showAnswer ? (
                      <Button onClick={() => setShowAnswer(true)} variant="outline">
                        Tampilkan Jawaban
                      </Button>
                    ) : (
                      <div className="flex gap-3 justify-center pt-4">
                        <Button
                          onClick={() => handleAnswer(false)}
                          variant="outline"
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Salah
                        </Button>
                        <Button
                          onClick={() => handleAnswer(true)}
                          className="gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Benar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="p-8">
              <CardContent className="space-y-6">
                <h2 className="text-3xl font-serif font-bold">Quiz Selesai! 🎉</h2>
                
                <div className="bg-secondary rounded-lg p-6">
                  <p className="text-5xl font-bold text-accent mb-2">
                    {Math.round((correctCount / flashcards.length) * 100)}%
                  </p>
                  <p className="text-muted-foreground">
                    {correctCount} benar dari {flashcards.length} pertanyaan
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetQuiz} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Ulangi Quiz
                  </Button>
                  <Button onClick={() => navigate("/dashboard")} className="gap-2">
                    <ChevronRight className="h-4 w-4" />
                    Ke Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
