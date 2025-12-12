import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Uses Gemini 2.5 Flash TTS to pronounce text.
 * Great for specific harakaat sounds.
 */
export const speakText = async (text: string, voiceName: 'Kore' | 'Puck' = 'Kore'): Promise<AudioBuffer | null> => {
  if (!apiKey) {
    console.error("No API Key provided");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say the following Arabic text clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) return null;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1
    );
    
    return audioBuffer;

  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

/**
 * Simple feedback generation for encouragement
 */
export const getEncouragement = async (score: number, total: number): Promise<string> => {
    if (!apiKey) return "أحسنت يا بطل!";
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Give a very short, exciting, simple 5-word Arabic encouragement for a child who got ${score} out of ${total} answers correct. Use emojis.`,
        });
        return response.text || "أنت رائع ومجتهد! 🌟";
    } catch (e) {
        return "أنت رائع ومجتهد! 🌟";
    }
}

// Helpers for Audio Decoding (from Google GenAI docs)
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
