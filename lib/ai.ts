import { GoogleGenAI, Type, type Schema } from "@google/genai";

export interface AIAnalysisResult {
  aiSummary: string;
  aiCategory: string;
  aiPriority: string;
  aiNextStep: string;
}

const DEFAULT_RESULT: AIAnalysisResult = {
  aiSummary: "Не удалось проанализировать",
  aiCategory: "Другое",
  aiPriority: "Средний",
  aiNextStep: "Изучить заявку вручную",
};

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    aiSummary: {
      type: Type.STRING,
      description: "Краткая суть обращения в одном предложении.",
    },
    aiCategory: {
      type: Type.STRING,
      description: "Подходящая категория обращения из одного-двух слов.",
    },
    aiPriority: {
      type: Type.STRING,
      format: "enum",
      enum: ["Высокий", "Средний", "Низкий"],
      description: "Срочность обращения.",
    },
    aiNextStep: {
      type: Type.STRING,
      description: "Следующее действие менеджера в одном предложении.",
    },
  },
  required: ["aiSummary", "aiCategory", "aiPriority", "aiNextStep"],
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  return new GoogleGenAI({ apiKey });
}

export async function analyzeTicketWithAI(
  text: string,
): Promise<AIAnalysisResult> {
  try {
    const response = await getGeminiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Проанализируй обращение клиента: ${text}`,
      config: {
        systemInstruction:
          "Ты анализируешь входящие заявки любой тематики для менеджера. Отвечай кратко и только в заданной структуре.",
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    return JSON.parse(response.text) as AIAnalysisResult;
  } catch (error) {
    console.error("Ошибка при обращении к AI:", error);
    return DEFAULT_RESULT;
  }
}
