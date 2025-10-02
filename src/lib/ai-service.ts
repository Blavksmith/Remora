// src/lib/ai-service.ts
// Service untuk generate flashcards langsung dari frontend

interface GenerateFlashcardsParams {
  title: string;
  notes: string;
}

interface Flashcard {
  question: string;
  answer: string;
}

interface GenerateFlashcardsResponse {
  flashcards: Flashcard[];
  count: number;
}

// Option 1: Menggunakan OpenAI API
export async function generateFlashcardsWithOpenAI(
  params: GenerateFlashcardsParams
): Promise<GenerateFlashcardsResponse> {
  const { title, notes } = params;

  // Get API key dari environment variable
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key tidak ditemukan. Tambahkan VITE_OPENAI_API_KEY di file .env');
  }

  const systemPrompt = `Kamu adalah asisten AI yang ahli dalam membuat flashcard untuk pembelajaran.

Tugas kamu:
1. Baca dan pahami catatan yang diberikan pengguna
2. Identifikasi konsep-konsep penting, definisi, fakta, dan hubungan antar konsep
3. Buat pertanyaan flashcard yang efektif untuk active recall dan spaced repetition
4. Pastikan pertanyaan mendorong pemahaman mendalam, bukan sekadar hafalan

Prinsip pembuatan flashcard yang baik:
- Pertanyaan harus jelas, spesifik, dan tidak ambigu
- Satu flashcard = satu konsep (hindari pertanyaan ganda)
- Gunakan teknik "pertanyaan terbuka" untuk konsep yang kompleks
- Gunakan "fill in the blank" untuk definisi dan istilah
- Untuk proses atau urutan, buat pertanyaan yang menguji pemahaman tahapan
- Jawaban harus lengkap namun ringkas (2-4 kalimat)

Buat 8-12 flashcard dari catatan yang diberikan. Variasikan tipe pertanyaan untuk cakupan yang menyeluruh.

Format output HARUS dalam JSON yang valid:
{
  "flashcards": [
    {
      "question": "Pertanyaan yang spesifik dan jelas?",
      "answer": "Jawaban yang lengkap dan ringkas."
    }
  ]
}`;

  const userPrompt = `Judul: ${title}

Catatan:
${notes}

Buatlah flashcard berkualitas tinggi dari catatan di atas. Fokus pada konsep penting yang perlu diingat untuk memahami topik ini.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gagal generate flashcard');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    // Validate and filter flashcards
    const validFlashcards = result.flashcards
      .filter((card: Flashcard) => 
        card.question && 
        card.answer && 
        card.question.trim().length > 10 &&
        card.answer.trim().length > 10
      )
      .slice(0, 15);

    if (validFlashcards.length === 0) {
      throw new Error('Tidak ada flashcard yang berhasil dibuat');
    }

    return {
      flashcards: validFlashcards,
      count: validFlashcards.length
    };

  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat generate flashcard');
  }
}

// Option 2: Menggunakan Anthropic Claude API
export async function generateFlashcardsWithClaude(
  params: GenerateFlashcardsParams
): Promise<GenerateFlashcardsResponse> {
  const { title, notes } = params;

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key tidak ditemukan. Tambahkan VITE_ANTHROPIC_API_KEY di file .env');
  }

  const prompt = `Kamu adalah asisten AI yang ahli dalam pedagogi dan pembuatan materi pembelajaran yang efektif.

Tugas kamu adalah membuat flashcard berkualitas tinggi dari catatan yang diberikan pengguna. Flashcard ini akan digunakan untuk active recall dan spaced repetition, metode belajar yang terbukti paling efektif untuk retensi jangka panjang.

PRINSIP PEMBUATAN FLASHCARD YANG BAIK:

1. Atomic (Satu Konsep Per Kartu)
   - Setiap flashcard hanya fokus pada SATU konsep atau fakta
   - Hindari pertanyaan ganda atau kompleks yang menguji banyak hal sekaligus
   
2. Pertanyaan yang Efektif
   - Pertanyaan harus SPESIFIK dan JELAS, tidak ambigu
   - Gunakan kata tanya yang tepat: "Apa", "Mengapa", "Bagaimana", "Jelaskan"
   - Untuk definisi: "Apa yang dimaksud dengan [istilah]?"
   - Untuk hubungan sebab-akibat: "Mengapa [X] menyebabkan [Y]?"
   - Untuk proses: "Jelaskan tahapan [proses]"
   - Untuk perbandingan: "Apa perbedaan antara [A] dan [B]?"

3. Jawaban yang Lengkap namun Ringkas
   - Jawaban harus LENGKAP dan AKURAT
   - Panjang ideal: 2-5 kalimat
   - Hindari jawaban yang terlalu umum atau terlalu detail
   - Sertakan konteks jika perlu untuk pemahaman

4. Variasi Tipe Pertanyaan
   - Definisi dan istilah kunci
   - Konsep dan teori utama
   - Hubungan sebab-akibat
   - Proses dan tahapan
   - Perbandingan dan kontras
   - Aplikasi dan contoh

5. Mendorong Pemahaman Mendalam
   - Fokus pada "mengapa" dan "bagaimana", bukan hanya "apa"
   - Test pemahaman konseptual, bukan sekadar hafalan
   - Pertanyaan harus membuat pembelajar BERPIKIR

CATATAN YANG AKAN DIPROSES:

Judul: ${title}

Isi Catatan:
${notes}

INSTRUKSI OUTPUT:
Buat 8-12 flashcard berkualitas tinggi dari catatan di atas. Identifikasi konsep-konsep paling penting yang HARUS dipahami dan diingat untuk menguasai topik ini.

Berikan output dalam format JSON yang VALID:
{
  "flashcards": [
    {
      "question": "Pertanyaan yang spesifik dan jelas?",
      "answer": "Jawaban yang lengkap, akurat, dan ringkas."
    }
  ]
}

PENTING: Pastikan output adalah JSON yang valid dan bisa di-parse. Jangan tambahkan teks di luar JSON.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gagal generate flashcard');
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Extract JSON from response (Claude might wrap it in markdown)
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                      content.match(/```\n?([\s\S]*?)\n?```/);
    
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    const result = JSON.parse(jsonContent.trim());

    // Validate and filter flashcards
    const validFlashcards = result.flashcards
      .filter((card: Flashcard) => 
        card.question && 
        card.answer && 
        card.question.trim().length > 10 &&
        card.answer.trim().length > 10
      )
      .slice(0, 15);

    if (validFlashcards.length === 0) {
      throw new Error('Tidak ada flashcard yang berhasil dibuat');
    }

    return {
      flashcards: validFlashcards,
      count: validFlashcards.length
    };

  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat generate flashcard');
  }
}

// Option 3: Menggunakan Groq (GRATIS dan CEPAT!)
export async function generateFlashcardsWithGroq(
  params: GenerateFlashcardsParams
): Promise<GenerateFlashcardsResponse> {
  const { title, notes } = params;

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key tidak ditemukan. Tambahkan VITE_GROQ_API_KEY di file .env');
  }

  const systemPrompt = `Kamu adalah asisten AI yang ahli dalam membuat flashcard untuk pembelajaran.

Buat 8-12 flashcard berkualitas dari catatan yang diberikan.

Prinsip:
- Pertanyaan jelas dan spesifik
- Satu konsep per kartu
- Jawaban lengkap tapi ringkas (2-4 kalimat)
- Fokus pada pemahaman, bukan hafalan

Output format JSON:
{
  "flashcards": [
    {"question": "...", "answer": "..."}
  ]
}`;

  const userPrompt = `Judul: ${title}\n\nCatatan:\n${notes}\n\nBuatlah flashcard berkualitas tinggi.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Model gratis dan cepat
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gagal generate flashcard');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    const validFlashcards = result.flashcards
      .filter((card: Flashcard) => 
        card.question && 
        card.answer && 
        card.question.trim().length > 10 &&
        card.answer.trim().length > 10
      )
      .slice(0, 15);

    if (validFlashcards.length === 0) {
      throw new Error('Tidak ada flashcard yang berhasil dibuat');
    }

    return {
      flashcards: validFlashcards,
      count: validFlashcards.length
    };

  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat generate flashcard');
  }
}

// Main function dengan fallback
export async function generateFlashcards(
  params: GenerateFlashcardsParams
): Promise<GenerateFlashcardsResponse> {
  // Coba Groq dulu (gratis dan cepat)
  if (import.meta.env.VITE_GROQ_API_KEY) {
    try {
      return await generateFlashcardsWithGroq(params);
    } catch (error) {
      console.warn('Groq failed, falling back to next option:', error);
    }
  }

  // Fallback ke Claude (paling bagus)
  if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
    try {
      return await generateFlashcardsWithClaude(params);
    } catch (error) {
      console.warn('Claude failed, falling back to OpenAI:', error);
    }
  }

  // Fallback ke OpenAI
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return await generateFlashcardsWithOpenAI(params);
  }

  throw new Error('Tidak ada API key yang ditemukan. Tambahkan minimal satu API key di file .env');
}