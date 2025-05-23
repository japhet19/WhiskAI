import { useState, useEffect, useCallback } from 'react';

interface UseTypingAnimationOptions {
  messages: string[];
  typingSpeed?: number; // milliseconds per character
  pauseDuration?: number; // pause between messages
  loop?: boolean;
}

interface UseTypingAnimationReturn {
  displayedText: string;
  currentMessageIndex: number;
  isTyping: boolean;
  reset: () => void;
}

export const useTypingAnimation = ({
  messages,
  typingSpeed = 50,
  pauseDuration = 2000,
  loop = true,
}: UseTypingAnimationOptions): UseTypingAnimationReturn => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const reset = useCallback(() => {
    setCurrentMessageIndex(0);
    setDisplayedText('');
    setIsTyping(true);
    setCurrentCharIndex(0);
  }, []);

  useEffect(() => {
    if (!messages.length) return;

    const currentMessage = messages[currentMessageIndex];

    if (isTyping) {
      if (currentCharIndex < currentMessage.length) {
        const timeoutId = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
        }, typingSpeed);

        return () => clearTimeout(timeoutId);
      } else {
        // Finished typing current message
        setIsTyping(false);
        
        const pauseTimeoutId = setTimeout(() => {
          const nextIndex = currentMessageIndex + 1;
          
          if (nextIndex < messages.length || loop) {
            setCurrentMessageIndex(loop ? nextIndex % messages.length : nextIndex);
            setDisplayedText('');
            setCurrentCharIndex(0);
            setIsTyping(true);
          }
        }, pauseDuration);

        return () => clearTimeout(pauseTimeoutId);
      }
    }
  }, [
    messages,
    currentMessageIndex,
    currentCharIndex,
    isTyping,
    typingSpeed,
    pauseDuration,
    loop,
  ]);

  return {
    displayedText,
    currentMessageIndex,
    isTyping,
    reset,
  };
};