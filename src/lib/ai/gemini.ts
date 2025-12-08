import { GoogleGenAI } from '@google/genai';
import Constants from 'expo-constants';

// Get API key from environment variables
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API key not found. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env.local file');
}

// Initialize Gemini AI client
let genAI: GoogleGenAI | null = null;

/**
 * Initialize Gemini AI client
 */
export function initializeGemini(): GoogleGenAI {
    if (!genAI && GEMINI_API_KEY) {
        genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }

    if (!genAI) {
        throw new Error('Gemini AI could not be initialized. API key is missing.');
    }

    return genAI;
}

/**
 * System prompt for Kur'an learning assistant
 * @param language - User's language preference (tr, en, etc.)
 */
const getSystemPrompt = (language: string = 'tr') => {
    if (language === 'en') {
        return `You are an AI assistant helping with Quran learning and Islamic topics.
Your task: Answer questions about Quran reading, Tajweed, Islamic history, Islamic ethics, and everything related to Islam.

RULES:
1. Your answers must STRICTLY NOT exceed 1024 tokens. Be short, concise, and clear.
2. NEVER answer racist, obscene, profane, or abusive questions.
3. Do not take sides or comment on sectarian (madhhab) or racial issues. Politely decline such questions by stating you avoid commenting on them.
4. If a question is outside the scope of Islam and Quran (e.g., football, politics, pop culture), decline with a witty/humorous response and steer the topic back to Islam/Quran. (Example: "I'm an expert on spiritual fields, not football fields. Let's study the Quran instead.")
5. Speak in English, be kind, patient, and educational.`;
    }

    // Default Turkish
    return `Sen Kur'an öğreniminde ve İslami konularda yardımcı olan bir AI asistanısın.
Görevin: Kur'an okuma, tecvid, İslam tarihi, İslam ahlakı ve İslamiyet ile ilgili tüm sorulara cevap vermek.

KURALLAR:
1. Cevapların KESİNLİKLE 1024 token'ı geçmemeli. Kısa, öz ve net ol.
2. Irkçı, müstehcen, küfürlü veya kötü niyetli sorulara ASLA cevap verme.
3. Mezhep veya ırk ayrımı içeren konularda taraf tutma, yorum yapma. Bu tür sorularda "Bu konuda yorum yapmaktan kaçınıyorum" diyerek nazikçe reddet.
4. İslam ve Kur'an dışındaki konularda (örneğin futbol, siyaset, magazin) soru gelirse, espritüel bir dille konuyu tekrar İslam'a veya Kur'an'a getirerek cevabı geçiştir. (Örnek: "Benim uzmanlık alanım yeşil sahalar değil, manevi sahalar. Gel biz seninle Kur'an çalışalım.")
5. Türkçe konuş, nazik, sabırlı ve öğretici ol.`;
};

/**
 * Message type for chat history
 */
export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
    timestamp: number;
}

/**
 * Send a message to Gemini and get response
 * @param message - User's message
 * @param history - Chat history
 * @param language - User's language preference (tr, en, etc.)
 */
export async function sendMessage(
    message: string,
    history: ChatMessage[] = [],
    language: string = 'tr'
): Promise<{ text: string; error?: string }> {
    try {
        const ai = initializeGemini();

        // Use Gemini 2.5 Flash model (latest stable version)
        const model = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: getSystemPrompt(language) }]
                },
                ...history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }]
                })),
                {
                    role: 'user',
                    parts: [{ text: message }]
                }
            ],
            config: {
                maxOutputTokens: 1024,
                temperature: 0.7,
            },
        });

        const response = await model;
        const text = response.text || 'Üzgünüm, bir yanıt oluşturamadım.';

        return { text };
    } catch (error: any) {
        console.error('Gemini API Error:', error);

        let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';

        if (error.message?.includes('API key')) {
            errorMessage = 'API anahtarı geçersiz. Lütfen ayarlarınızı kontrol edin.';
        } else if (error.message?.includes('quota')) {
            errorMessage = 'API kullanım limitine ulaşıldı. Lütfen daha sonra tekrar deneyin.';
        } else if (error.message?.includes('network')) {
            errorMessage = 'İnternet bağlantınızı kontrol edin.';
        }

        return { text: '', error: errorMessage };
    }
}

/**
 * Start a new chat session
 */
export function createChatSession() {
    const messages: ChatMessage[] = [];

    return {
        messages,
        async sendMessage(text: string) {
            const userMessage: ChatMessage = {
                role: 'user',
                parts: text,
                timestamp: Date.now(),
            };

            messages.push(userMessage);

            const response = await sendMessage(text, messages.slice(0, -1));

            if (response.text) {
                const aiMessage: ChatMessage = {
                    role: 'model',
                    parts: response.text,
                    timestamp: Date.now(),
                };
                messages.push(aiMessage);
            }

            return response;
        },
        clearHistory() {
            messages.length = 0;
        },
    };
}
