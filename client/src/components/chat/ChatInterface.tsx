import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import geminiService from '../../services/api/geminiService';
import { CurieAvatar } from '../common';
import { FadeSlideUp } from '../ui/animations';

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
    setMessages([
      {
        id: Date.now(),
        text: "Hello! I'm Curie, your AI food companion. I'm here to help with recipes, cooking tips, and food inspiration. What would you like to talk about today?",
        sender: 'ai',
      },
    ]);

    // Initialize the chat in the background
    geminiService.initChat().catch((error) => {
      console.error('Error initializing chat:', error);
      // If there's an initialization error, show it after the welcome message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "I'm having trouble connecting to my brain. Let me try again or please refresh the page if this continues.",
          sender: 'ai',
        },
      ]);
    });
  }, []);

  useEffect(() => {
    // Auto scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Create placeholder for AI response with streaming flag
    const aiMessageId = Date.now() + 1;
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(true);

    try {
      // Use streaming API
      await geminiService.sendMessageStream(
        input,
        // Handle each chunk
        (chunk: string) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
            )
          );
        },
        // Handle completion
        () => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
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
          errorMessage =
            'Error: The specified model is not available. The app has been updated to use a different model.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Error: API quota exceeded. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('CORS')) {
          errorMessage = 'Error: Network issue. Please check your internet connection.';
        } else {
          // Include part of the actual error message for debugging
          errorMessage = `Error: ${error.message.substring(0, 100)}${
            error.message.length > 100 ? '...' : ''
          }`;
        }
      }

      // Update the placeholder with error message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId ? { ...msg, text: errorMessage, isStreaming: false } : msg
        )
      );

      setIsLoading(false);
    }
  };

  // Function to render the typing indicator for streaming messages
  const renderTypingIndicator = (): React.ReactElement => (
    <span className="inline-flex items-center ml-2">
      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse ml-1 animation-delay-200" />
      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse ml-1 animation-delay-400" />
    </span>
  );

  return (
    <div className="flex flex-col w-full max-w-6xl h-[75vh] mx-auto rounded-2xl shadow-xl overflow-hidden bg-white border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <CurieAvatar size="md" animated={false} className="border-2 border-white" />
          <h2 className="text-xl font-semibold">Chat with Curie</h2>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <FadeSlideUp
              key={message.id}
              delay={index * 0.05}
              duration={0.3}
              distance={10}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {message.sender === 'ai' && (
                  <CurieAvatar 
                    size="sm" 
                    animated={index === 0}
                    showPulse={message.isStreaming}
                  />
                )}
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                <div className="message-content">
                  {message.sender === 'user' ? (
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => (
                            <strong className="font-bold text-primary-700">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-gray-700">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2">
                              {children}
                            </pre>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
                          ),
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              className="text-primary-600 hover:text-primary-700 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                      {message.isStreaming && renderTypingIndicator()}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </FadeSlideUp>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        className="flex items-center gap-3 p-4 bg-gray-50 border-t border-gray-200"
        onSubmit={handleSend}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Curie about food, recipes, cooking tips..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;