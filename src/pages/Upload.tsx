import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Sparkles, Save, Loader2 } from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

const Upload = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ambil API key dari environment variable
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const generateFlashcardsWithGemini = async (title: string, notes: string) => {
    const prompt = `Kamu adalah asisten AI yang ahli dalam membuat flashcard berkualitas tinggi untuk membantu siswa belajar secara efektif menggunakan teknik spaced repetition dan active recall.

CATATAN SISWA:
Judul: ${title}
Isi: ${notes}

TUGAS:
Buat 8-15 flashcard berkualitas tinggi dari catatan di atas. Flashcard harus:

1. MEMACU PENGINGATAN AKTIF - buat pertanyaan yang memaksa siswa mengingat, bukan hanya mengenali
2. SPESIFIK & JELAS - hindari pertanyaan yang ambigu
3. SATU KONSEP PER KARTU - jangan gabungkan banyak informasi
4. GUNAKAN BERBAGAI TIPE PERTANYAAN:
   - "Apa definisi dari...?"
   - "Jelaskan perbedaan antara X dan Y"
   - "Bagaimana proses X terjadi?"
   - "Mengapa X penting untuk Y?"
   - "Sebutkan contoh dari..."
   - "Apa fungsi dari...?"

5. JAWABAN HARUS:
   - Ringkas tapi lengkap
   - Mudah diingat
   - Berisi informasi kunci dari catatan

FORMAT OUTPUT (HARUS JSON VALID):
{
  "flashcards": [
    {
      "question": "Pertanyaan yang spesifik dan jelas",
      "answer": "Jawaban ringkas namun lengkap"
    }
  ]
}

PENTING: 
- Output HANYA JSON, tanpa markdown atau text tambahan
- Buat pertanyaan dalam bahasa yang sama dengan catatan (Indonesia/Inggris/campur)
- Prioritaskan konsep paling penting terlebih dahulu`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;

    // Clean up response - remove markdown code blocks if present
    let cleanedResponse = textResponse.trim();
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, "");
    cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    cleanedResponse = cleanedResponse.trim();

    const parsedData = JSON.parse(cleanedResponse);
    return parsedData.flashcards;
  };

  const handleGenerate = async () => {
    if (!notes.trim() || !title.trim()) {
      toast({
        title: "Error",
        description: "Judul dan catatan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    if (notes.trim().split(/\s+/).length < 50) {
      toast({
        title: "Catatan Terlalu Pendek",
        description: "Minimal 50 kata untuk menghasilkan flashcard berkualitas",
        variant: "destructive",
      });
      return;
    }

    if (!GEMINI_API_KEY) {
      toast({
        title: "API Key Belum Diisi",
        description: "Silakan setup VITE_GEMINI_API_KEY di file .env",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      const generatedFlashcards = await generateFlashcardsWithGemini(title, notes);

      if (!generatedFlashcards || generatedFlashcards.length === 0) {
        throw new Error("Gagal menghasilkan flashcard. Coba lagi.");
      }

      setFlashcards(generatedFlashcards);

      toast({
        title: "Flashcard Generated!",
        description: `${generatedFlashcards.length} flashcard telah dibuat dari catatanmu`,
      });
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat generate flashcard",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (flashcards.length === 0) {
      toast({
        title: "Error",
        description: "Generate flashcard terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data: setData, error: setError } = await supabase
        .from("flashcard_sets")
        .insert({
          user_id: user?.id,
          title: title,
          source_text: notes,
        })
        .select()
        .single();

      if (setError) throw setError;

      const { error: cardsError } = await supabase
        .from("flashcards")
        .insert(
          flashcards.map((card) => ({
            set_id: setData.id,
            question: card.question,
            answer: card.answer,
          }))
        );

      if (cardsError) throw cardsError;

      toast({
        title: "Berhasil Disimpan!",
        description: "Flashcard set telah disimpan ke dashboard",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            <p className="text-[#6B7280] font-['Open_Sans']">Memuat...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FA] via-[#F9FAFB] to-[#E6F0FA]">
      <Navbar user={user} />

      <main className="container py-8 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="p-3 bg-gradient-to-br from-[#A7C1A7] to-[#A7C1A7]/80 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-['Lora'] font-bold text-[#6B7280]">
                  Buat Flashcard Baru
                </h1>
              </div>
            </motion.div>
            <p className="text-[#6B7280]/70 font-['Open_Sans'] text-lg ml-[60px]">
              Paste catatanmu dan biarkan AI membuat flashcard berkualitas untukmu
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg rounded-2xl bg-white">
                <CardHeader className="border-b border-[#E6F0FA]">
                  <CardTitle className="font-['Lora'] text-2xl text-[#6B7280]">
                    Input Catatan
                  </CardTitle>
                  <CardDescription className="font-['Open_Sans'] text-[#6B7280]/60">
                    Masukkan judul dan catatan yang ingin diubah jadi flashcard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="font-['Open_Sans'] text-[#6B7280] font-semibold"
                    >
                      Judul Flashcard Set
                    </Label>
                    <Input
                      id="title"
                      placeholder="contoh: Biologi - Sistem Pencernaan"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border-2 border-[#E6F0FA] focus:border-[#A7C1A7] rounded-xl font-['Open_Sans']"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="font-['Open_Sans'] text-[#6B7280] font-semibold"
                    >
                      Catatan
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Paste catatanmu di sini... 

Tips untuk hasil terbaik:
- Pastikan catatan lengkap dan terstruktur
- Minimal 50 kata
- Sertakan konsep, definisi, dan penjelasan
- Tulis dengan jelas dan sistematis"
                      className="min-h-[350px] resize-none border-2 border-[#E6F0FA] focus:border-[#A7C1A7] rounded-xl font-['Open_Sans']"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#6B7280]/60 font-['Open_Sans']">
                        {notes.split(/\s+/).filter((w) => w).length} kata
                      </p>
                      {notes.split(/\s+/).filter((w) => w).length >= 50 && (
                        <p className="text-sm text-[#A7C1A7] font-['Open_Sans'] flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Siap untuk di-generate!
                        </p>
                      )}
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="w-full gap-2 bg-gradient-to-r from-[#A7C1A7] to-[#A7C1A7]/90 hover:from-[#A7C1A7]/90 hover:to-[#A7C1A7] text-white shadow-lg rounded-xl py-6 font-['Open_Sans'] font-semibold text-base"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          AI Sedang Bekerja...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate Flashcards dengan AI
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {generating && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-[#E6F0FA] rounded-xl p-4"
                    >
                      <p className="text-sm text-[#6B7280] font-['Open_Sans'] text-center">
                        AI sedang menganalisis catatanmu dan membuat pertanyaan yang
                        membantu mengingat...
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg rounded-2xl bg-white">
                <CardHeader className="border-b border-[#E6F0FA]">
                  <CardTitle className="font-['Lora'] text-2xl text-[#6B7280]">
                    Preview Flashcards
                  </CardTitle>
                  <CardDescription className="font-['Open_Sans'] text-[#6B7280]/60">
                    {flashcards.length > 0
                      ? `${flashcards.length} flashcard telah dibuat oleh AI`
                      : "Flashcard akan muncul di sini setelah di-generate"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {flashcards.length === 0 ? (
                    <div className="text-center py-16">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="h-16 w-16 mx-auto mb-4 text-[#A7C1A7]/50" />
                      </motion.div>
                      <p className="text-[#6B7280]/60 font-['Open_Sans']">
                        Generate flashcard untuk melihat preview
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        {flashcards.map((card, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="hover:shadow-md transition-all border border-[#E6F0FA] rounded-xl overflow-hidden group">
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <p className="font-['Open_Sans'] font-semibold text-xs text-[#A7C1A7] uppercase tracking-wider">
                                      Pertanyaan {index + 1}
                                    </p>
                                    <div className="w-8 h-8 rounded-full bg-[#E6F0FA] flex items-center justify-center group-hover:bg-[#A7C1A7] transition-colors">
                                      <span className="text-xs font-bold text-[#6B7280] group-hover:text-white transition-colors">
                                        {index + 1}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="font-['Lora'] font-medium text-[#6B7280] leading-relaxed">
                                    {card.question}
                                  </p>
                                  <div className="border-t border-[#E6F0FA] pt-3">
                                    <p className="text-xs font-['Open_Sans'] font-semibold text-[#6B7280]/50 uppercase tracking-wider mb-2">
                                      Jawaban
                                    </p>
                                    <p className="text-sm font-['Open_Sans'] text-[#6B7280]/70 leading-relaxed">
                                      {card.answer}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: flashcards.length * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6"
                      >
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="w-full gap-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280]/90 hover:from-[#6B7280]/90 hover:to-[#6B7280] text-white shadow-lg rounded-xl py-6 font-['Open_Sans'] font-semibold text-base"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Menyimpan...
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              Simpan Flashcard Set ke Dashboard
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #E6F0FA;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #A7C1A7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8fa88f;
        }
      `}</style>
    </div>
  );
};

export default Upload;