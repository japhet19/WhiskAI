import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
// Import the Gemini service
import geminiService from '../services/geminiService';
import './ChatInterface.css';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  isStreaming?: boolean;
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat session and add welcome message
    setMessages([{
      id: Date.now(),
      text: "Hello! I'm Curie, your AI food companion. I'm here to help with recipes, cooking tips, and food inspiration. What would you like to talk about today?",
      sender: 'ai'
    }]);
    
    // Initialize the chat in the background
    geminiService.initChat()
      .catch(error => {
        console.error('Error initializing chat:', error);
        // If there's an initialization error, show it after the welcome message
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "I'm having trouble connecting to my brain. Let me try again or please refresh the page if this continues.",
          sender: 'ai'
        }]);
      });
  }, []);

  useEffect(() => {
    // Auto scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Create placeholder for AI response with streaming flag
    const aiMessageId = Date.now() + 1;
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(true);
    
    try {
      // Use streaming API
      await geminiService.sendMessageStream(
        input,
        // Handle each chunk
        (chunk: string) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === aiMessageId
                ? { ...msg, text: msg.text + chunk }
                : msg
            )
          );
        },
        // Handle completion
        () => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === aiMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error getting response:', error);
      
      let errorMessage = 'Sorry, there was an error processing your request.';
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Error: API key issue. Please check your Gemini API key configuration.';
        } else if (error.message.includes('model')) {
          errorMessage = 'Error: The specified model is not available. The app has been updated to use a different model.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Error: API quota exceeded. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('CORS')) {
          errorMessage = 'Error: Network issue. Please check your internet connection.';
        } else {
          // Include part of the actual error message for debugging
          errorMessage = `Error: ${error.message.substring(0, 100)}${error.message.length > 100 ? '...' : ''}`;
        }
      }
      
      // Update the placeholder with error message
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === aiMessageId
            ? { ...msg, text: errorMessage, isStreaming: false }
            : msg
        )
      );
      
      setIsLoading(false);
    }
  };

  // Function to render the typing indicator for streaming messages
  const renderTypingIndicator = () => (
    <span className="typing-indicator">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </span>
  );

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Curie - Your AI Food Companion</h2>
      </div>
      
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-bubble">
              <div className="message-content">
                {message.sender === 'user' ? (
                  message.text
                ) : (
                  <>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                    {message.isStreaming && renderTypingIndicator()}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-area" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Curie about food, recipes, cooking tips..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;