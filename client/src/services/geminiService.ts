import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';

// Initialize with API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

// Validate API key
if (!API_KEY) {
  console.error('Gemini API key is missing. Please check your .env file.');
}

// Initialize the Google GenAI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Definition for message types
export type MessageType = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  isStreaming?: boolean;
};

// Internal chat state
let model: GenerativeModel | null = null;
let chatSession: any = null;

// Use the latest Gemini model
const MODEL = 'models/gemini-2.5-flash-preview-05-20';

/**
 * Initialize a chat session with Gemini
 */
export const initChat = async (): Promise<void> => {
  console.log('Initializing Gemini chat service...');
  
  try {
    console.log(`Initializing with model: ${MODEL}`);
    
    // Create a generative model instance
    model = genAI.getGenerativeModel({ model: MODEL });
    
    // Create generation config
    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    };
    
    // Set up the initial message as 'user' role with the system instructions
    // Gemini requires the first message to have role 'user'
    const initialMessage = {
      role: 'user',
      parts: [{ text: "Please behave as follows: You are Curie, the AI food companion for WhiskAI. Your mission is to inspire culinary creativity and simplify food management. Engage users with interesting recipe suggestions, explore diverse cuisines, and offer tips for elevating their cooking skills. While managing inventory and meal plans, maintain an enthusiastic and curious tone. Encourage experimentation and learning in the kitchen. You are intelligent, adaptable, and passionate about all things food. Help users discover new favorites and enjoy the process of cooking." }]
    };
    
    // Model response to the initial message
    const modelResponse = {
      role: 'model',
      parts: [{ text: "I understand! I'll be Curie, your AI food companion. I'm here to help with recipes, cooking tips, and food inspiration. How can I assist you with your culinary needs today?" }]
    };
    
    // Create chat session with the initial exchange in history
    chatSession = model.startChat({
      generationConfig,
      history: [initialMessage, modelResponse],
    });
    
    console.log(`Successfully initialized chat with model: ${MODEL}`);
  } catch (error) {
    console.error(`Failed to initialize Gemini model:`, error);
    throw error;
  }
};

// System instructions are included as a user-model exchange in history

/**
 * Send a message to the Gemini chat and get a response
 */
export const sendMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initChat();
  }
  
  if (!chatSession) {
    throw new Error('Chat session could not be initialized');
  }
  
  try {
    console.log('Sending message to Gemini:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));
    
    // Send the message to the chat
    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    
    // Try to reinitialize the session
    try {
      console.log('Attempting to reinitialize chat session...');
      chatSession = null;
      model = null;
      await initChat();
    } catch (reinitError) {
      console.error('Failed to reinitialize chat session:', reinitError);
    }
    
    throw error;
  }
};

/**
 * Send a message and stream the response chunks
 */
export const sendMessageStream = async (
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> => {
  if (!chatSession) {
    await initChat();
  }
  
  if (!chatSession) {
    throw new Error('Chat session could not be initialized');
  }
  
  try {
    console.log('Sending streaming message to Gemini:', 
      message.substring(0, 50) + (message.length > 50 ? '...' : ''));
    
    // Send the message to the chat with streaming response
    const result = await chatSession.sendMessageStream(message);
    
    // Process each chunk as it arrives
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }
    
    console.log('Message stream completed successfully');
    onComplete();
  } catch (error) {
    console.error('Error streaming message with Gemini:', error);
    
    // Try to reinitialize the session
    try {
      console.log('Attempting to reinitialize chat session...');
      chatSession = null;
      model = null;
      await initChat();
    } catch (reinitError) {
      console.error('Failed to reinitialize chat session:', reinitError);
    }
    
    throw error;
  }
};

// Named export for the service
const newGeminiService = {
  initChat,
  sendMessage,
  sendMessageStream,
};

export default newGeminiService;