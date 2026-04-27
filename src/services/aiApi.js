import axios from "axios";

// Baca dari environment variables
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const BASE_URL = import.meta.env.VITE_GROQ_BASE_URL;

const ISLAMIC_SYSTEM_PROMPT = `
Kamu adalah asisten AI Islami yang bernama "IslamicAI". 
Peranmu adalah menjawab pertanyaan seputar Islam, Al-Quran, Hadits, Fiqih, Sejarah Islam, dan Tata Cara Ibadah.
Kamu JUGA bisa membuatkan teks Khutbah Jumat atau Ceramah singkat jika diminta.
Jika pengguna bertanya di luar konteks Islam (seperti politik, coding, hiburan, atau hal duniawi lainnya), tolak dengan sopan dan arahkan kembali ke topik Islam.
Jawab dengan bahasa Indonesia yang baik, benar, dan sopan.
`;

export const askIslamicAI = async (conversationHistory) => {
  // Proteksi jika key kosong
  if (!API_KEY) {
    throw new Error("API Key belum diset di file .env");
  }

  try {
    const messages = [
      { role: "system", content: ISLAMIC_SYSTEM_PROMPT },
      ...conversationHistory,
    ];

    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error calling AI API:",
      error.response?.data || error.message,
    );

    if (error.response?.status === 400) {
      throw new Error(
        "Model AI sedang sibuk atau tidak tersedia. Coba lagi nanti.",
      );
    }

    throw new Error(
      error.response?.data?.error?.message || "Gagal menghubungi AI",
    );
  }
};
