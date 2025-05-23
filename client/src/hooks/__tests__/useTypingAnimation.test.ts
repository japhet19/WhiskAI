import { renderHook, act } from '@testing-library/react';
import { useTypingAnimation } from '../useTypingAnimation';

describe('useTypingAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should start with empty text and first message index', () => {
    const messages = ['Hello', 'World'];
    const { result } = renderHook(() => 
      useTypingAnimation({ messages })
    );

    expect(result.current.displayedText).toBe('');
    expect(result.current.currentMessageIndex).toBe(0);
    expect(result.current.isTyping).toBe(true);
  });

  it('should type out first message character by character', () => {
    const messages = ['Hello'];
    const { result } = renderHook(() => 
      useTypingAnimation({ messages, typingSpeed: 100 })
    );

    // Initially empty
    expect(result.current.displayedText).toBe('');

    // After 100ms, first character
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('H');

    // After 200ms total, two characters
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('He');

    // Complete the message
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.displayedText).toBe('Hello');
    expect(result.current.isTyping).toBe(false);
  });

  it('should pause between messages', () => {
    const messages = ['Hi', 'Bye'];
    const { result } = renderHook(() => 
      useTypingAnimation({ 
        messages, 
        typingSpeed: 50, 
        pauseDuration: 1000 
      })
    );

    // Type first message (2 chars * 50ms)
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('Hi');
    expect(result.current.currentMessageIndex).toBe(0);

    // Still in pause
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.currentMessageIndex).toBe(0);

    // After pause, should move to next message
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.currentMessageIndex).toBe(1);
    expect(result.current.displayedText).toBe('');
    expect(result.current.isTyping).toBe(true);
  });

  it('should loop through messages when loop is true', () => {
    const messages = ['A', 'B'];
    const { result } = renderHook(() => 
      useTypingAnimation({ 
        messages, 
        typingSpeed: 50, 
        pauseDuration: 100,
        loop: true 
      })
    );

    // Type first message
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current.displayedText).toBe('A');

    // Pause and move to second message
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.currentMessageIndex).toBe(1);

    // Type second message
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current.displayedText).toBe('B');

    // Should loop back to first message
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.currentMessageIndex).toBe(0);
  });

  it('should not loop when loop is false', () => {
    const messages = ['A', 'B'];
    const { result } = renderHook(() => 
      useTypingAnimation({ 
        messages, 
        typingSpeed: 50, 
        pauseDuration: 100,
        loop: false 
      })
    );

    // Type through both messages
    act(() => {
      jest.advanceTimersByTime(50); // Type 'A'
      jest.advanceTimersByTime(100); // Pause
      jest.advanceTimersByTime(50); // Type 'B'
      jest.advanceTimersByTime(100); // Pause
    });

    // Should stay at last message
    expect(result.current.currentMessageIndex).toBe(1);
    expect(result.current.displayedText).toBe('B');
  });

  it('should reset animation when reset is called', () => {
    const messages = ['Hello', 'World'];
    const { result } = renderHook(() => 
      useTypingAnimation({ messages, typingSpeed: 50 })
    );

    // Type some characters
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current.displayedText).toBe('Hel');

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.displayedText).toBe('');
    expect(result.current.currentMessageIndex).toBe(0);
    expect(result.current.isTyping).toBe(true);
  });

  it('should handle empty messages array', () => {
    const { result } = renderHook(() => 
      useTypingAnimation({ messages: [] })
    );

    expect(result.current.displayedText).toBe('');
    expect(result.current.currentMessageIndex).toBe(0);
    
    // Should not crash when advancing timers
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.displayedText).toBe('');
  });

  it('should handle single message without looping', () => {
    const messages = ['Single'];
    const { result } = renderHook(() => 
      useTypingAnimation({ 
        messages, 
        typingSpeed: 50,
        loop: false 
      })
    );

    // Type the message
    act(() => {
      jest.advanceTimersByTime(300); // 6 chars * 50ms
    });

    expect(result.current.displayedText).toBe('Single');
    expect(result.current.isTyping).toBe(false);
    
    // Should stay at the same message
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(result.current.displayedText).toBe('Single');
    expect(result.current.currentMessageIndex).toBe(0);
  });

  it('should update typing speed dynamically', () => {
    const messages = ['Test'];
    let typingSpeed = 100;
    
    const { result, rerender } = renderHook(() => 
      useTypingAnimation({ messages, typingSpeed })
    );

    // Type first character at 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('T');

    // Change typing speed
    typingSpeed = 50;
    rerender();

    // Next character should use new speed
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current.displayedText).toBe('Te');
  });
});