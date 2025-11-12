
import { GoogleGenAI, Modality, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `'${prompt}'에 대한 고요하고 사실적이며 차분한 명상 시각 자료. 영화적인 조명, 높은 디테일.`,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  });

  const base64ImageBytes = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateMeditationScript = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `이 테마를 바탕으로 짧고 차분한 가이드 명상 스크립트를 한국어로 작성해 주세요: "${prompt}". 스크립트는 마음을 진정시키고 따라하기 쉬워야 합니다. 분량은 200~300자 내외로 해주세요. 제목이나 소개 없이 바로 명상으로 시작해 주세요.`,
    config: {
        systemInstruction: "당신은 가이드 명상 스크립트 작가입니다. 사용자의 테마를 바탕으로 짧고 차분한 명상 스크립트를 한국어로 만듭니다. 스크립트는 부드러운 톤으로 작성되어 마음을 진정시키고 누구나 쉽게 따라할 수 있습니다."
    }
  });
  return response.text;
};

export const generateSpeech = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, soothing voice
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Audio generation failed, no data received.");
    }
    return base64Audio;
};


export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: '당신은 젠가든 명상 앱을 위한 도움이 되는 AI 어시스턴트입니다. 마음챙김, 명상 또는 일반적인 주제에 대한 사용자의 질문에 차분하고 친근한 톤으로 한국어로 답변해 주세요.',
        },
    });
}

export const getChatBotResponse = async (chat: Chat, message: string): Promise<string> => {
    const response = await chat.sendMessage({ message });
    return response.text;
}