import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { Duel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We simulate a database of votes by asking the AI to predict realistic splits
// In a real production app, 'percentage' would come from the backend database.

export const generateDuel = async (category: string): Promise<Duel> => {
  try {
    const prompt = `
      Gere um cenário de duelo "O que você prefere?" (Would you rather) divertido e engajante para a categoria: ${category}.
      O público alvo é brasileiro, jovem adulto.
      
      Retorne dois cenários opostos.
      Simule uma porcentagem de votos realista baseada no que a maioria das pessoas escolheria (a soma deve ser 100).
      O 'totalVotes' deve ser um número aleatório entre 1500 e 50000 para parecer popular.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "A pergunta principal, ex: 'Você prefere...'" },
            optionA: { type: Type.STRING, description: "Primeira opção curta e impactante" },
            optionAPercent: { type: Type.INTEGER, description: "Porcentagem estimada para opção A (0-100)" },
            optionB: { type: Type.STRING, description: "Segunda opção curta e impactante" },
            optionBPercent: { type: Type.INTEGER, description: "Porcentagem estimada para opção B (0-100)" },
            totalVotes: { type: Type.INTEGER },
          },
          required: ["question", "optionA", "optionAPercent", "optionB", "optionBPercent", "totalVotes"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");

    // Fallback if parsing fails or returns empty
    if (!data.question) {
      throw new Error("Invalid format from AI");
    }

    return {
      id: crypto.randomUUID(),
      category,
      question: data.question,
      totalVotes: data.totalVotes,
      options: [
        { id: "A", text: data.optionA, percentage: data.optionAPercent },
        { id: "B", text: data.optionB, percentage: data.optionBPercent },
      ],
    };

  } catch (error) {
    console.error("Failed to generate duel:", error);
    // Fallback content in case of API error
    return {
      id: "fallback-1",
      category: "Vida",
      question: "Você prefere...",
      totalVotes: 12403,
      options: [
        { id: "A", text: "Ter dinheiro infinito mas nenhum amigo", percentage: 15 },
        { id: "B", text: "Ter amigos leais mas salário mínimo pra sempre", percentage: 85 },
      ],
    };
  }
};
