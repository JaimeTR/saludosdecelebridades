
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY! }); 

const formatIdeas = (text: string): string => {
  // Replace numbered lists or bullet points with newlines for better display
  return text.replace(/(\d+\.\s*|- \s*|\*\s*)/g, '\n- ').replace(/\n\s*\n/g, '\n').trim();
};

export const generateGreetingIdea = async (occasion: string, recipientName: string): Promise<string> => {
  if (!API_KEY) {
    console.warn("API Key de Gemini no encontrada. Se usará respuesta mock para generarSugerenciaSaludo.");
    if (occasion.toLowerCase().includes('cumpleaños')) {
      return formatIdeas(`- ¡Feliz Cumpleaños al increíble ${recipientName}! ¡Espero que tengas un día fantástico lleno de alegría y risas! Considera mencionar un recuerdo compartido o una cualidad especial.\n- Que este nuevo año de vida te traiga mucha felicidad, ${recipientName}.`);
    }
    return formatIdeas(`- ¡Pensando en ti en esta especial ${occasion}! Espero que sea un momento maravilloso para ${recipientName}. ¡Personalízalo con un deseo o pensamiento específico!\n- Muchas felicidades en tu ${occasion}, ${recipientName}!`);
  }

  try {
    const model = 'gemini-2.5-flash-preview-04-17';
    const prompt = `Genera algunas ideas cortas y alegres para un saludo para ${recipientName} por su ${occasion}. Sé creativo y edificante. Proporciona 2-3 opciones distintas si es posible, cada una de menos de 50 palabras. Responde en español.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return formatIdeas(response.text);
  } catch (error) {
    console.error("Error llamando a la API de Gemini (generarSugerenciaSaludo):", error);
    return "Lo siento, no pude generar una idea en este momento. ¡Por favor, intenta crear tu propio mensaje maravilloso!";
  }
};

export const generateImageWithImagen = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    console.warn("API Key de Gemini no encontrada. Se usará respuesta mock para generateImageWithImagen.");
    return `https://picsum.photos/seed/${prompt.replace(/\s+/g, '_')}/300/200`;
  }
  
  try {
    const model = 'imagen-3.0-generate-002';
    const response = await ai.models.generateImages({
      model: model,
      prompt: `Concepto visual para un saludo: ${prompt}. Estilo alegre y festivo.`, // Prompt en español
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        console.error("La API de Imagen no devolvió bytes de imagen como se esperaba:", response);
        return 'https://picsum.photos/seed/imagen_sin_datos/300/200'; 
    }
  } catch (error) {
    console.error("Error llamando a la API de Imagen (generateImageWithImagen):", error);
    return 'https://picsum.photos/seed/imagen_error/300/200'; 
  }
};

export interface AdminSuggestions {
  videoScriptSuggestion: string;
  adminNoteSuggestion: string;
}

export const generarSugerenciasAdmin = async (
  occasion: string, 
  recipientName: string, 
  fanMessage: string
): Promise<AdminSuggestions> => {
  if (!API_KEY) {
    console.warn("API Key de Gemini no encontrada. Se usará respuesta mock para generarSugerenciasAdmin.");
    return {
      videoScriptSuggestion: formatIdeas(`- Hola ${recipientName}, ¡feliz ${occasion}! Solo quería enviarte un saludo especial. ${fanMessage.substring(0,50)}...\n- ¡Qué emoción celebrar tu ${occasion} contigo, ${recipientName}!`),
      adminNoteSuggestion: `Revisar solicitud para ${recipientName} (${occasion}). Parece estándar. Considerar añadir un toque personal basado en el mensaje del fan.`
    };
  }

  try {
    const model = 'gemini-2.5-flash-preview-04-17';
    const prompt = `Soy un famoso gestionando una solicitud de video saludo.
    La solicitud es para: ${recipientName}.
    Ocasión: ${occasion}.
    Mensaje del fan: "${fanMessage}".

    Por favor, ayúdame con lo siguiente (responde en español):
    1.  Genera 2-3 ideas concisas y entusiastas para el guion del video que podría grabar (cada idea de menos de 60 palabras).
    2.  Sugiere una breve nota administrativa interna para esta solicitud (menos de 30 palabras).

    Formatea tu respuesta claramente, separando las ideas para el guion y la nota administrativa. Por ejemplo:
    IDEAS DE GUION:
    - Idea 1...
    - Idea 2...
    NOTA ADMINISTRATIVA:
    - Nota...`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const textResponse = response.text;
    let videoScriptSuggestion = "No se pudo generar sugerencia de guion.";
    let adminNoteSuggestion = "No se pudo generar sugerencia de nota.";

    const scriptMatch = textResponse.match(/IDEAS DE GUION:([\s\S]*?)(NOTA ADMINISTRATIVA:|$)/i);
    if (scriptMatch && scriptMatch[1]) {
      videoScriptSuggestion = formatIdeas(scriptMatch[1].trim());
    }

    const noteMatch = textResponse.match(/NOTA ADMINISTRATIVA:([\s\S]*)/i);
    if (noteMatch && noteMatch[1]) {
      adminNoteSuggestion = formatIdeas(noteMatch[1].trim());
    }
    
    if (videoScriptSuggestion === "No se pudo generar sugerencia de guion." && adminNoteSuggestion === "No se pudo generar sugerencia de nota." && textResponse.length > 10){
        // Fallback if parsing fails but text exists
        videoScriptSuggestion = formatIdeas(textResponse);
    }


    return { videoScriptSuggestion, adminNoteSuggestion };

  } catch (error) {
    console.error("Error llamando a la API de Gemini (generarSugerenciasAdmin):", error);
    return {
      videoScriptSuggestion: "Lo siento, no pude generar sugerencias para el guion en este momento.",
      adminNoteSuggestion: "No se pudo generar sugerencia de nota administrativa."
    };
  }
};
