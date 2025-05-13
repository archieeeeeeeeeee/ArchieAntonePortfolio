import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface TypingEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
}

const TypingEffect = ({ 
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 1500,
  className = ''
}: TypingEffectProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const textRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Cursor blinking animation
    const cursorTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true
    });
    
    const cursorElement = textRef.current?.nextElementSibling;
    
    if (cursorElement) {
      cursorTimeline.to(cursorElement, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.inOut"
      });
    }
    
    return () => {
      cursorTimeline.kill();
    };
  }, []);
  
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        // Delete one character
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        
        // If all characters are deleted
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      } else {
        // Type one character
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        
        // If word is complete
        if (displayText.length === currentWord.length) {
          // Wait before deleting
          setTimeout(() => {
            setIsDeleting(true);
          }, delayBetweenWords);
          return;
        }
      }
    };
    
    // Set timeout for next character
    const timeout = setTimeout(
      handleTyping, 
      isDeleting ? deletingSpeed : typingSpeed
    );
    
    return () => clearTimeout(timeout);
  }, [
    words, 
    currentWordIndex, 
    isDeleting, 
    displayText, 
    typingSpeed, 
    deletingSpeed,
    delayBetweenWords
  ]);
  
  return (
    <div className="inline-flex items-center">
      <span ref={textRef} className={className}>{displayText}</span>
      <span className="cursor inline-block w-[2px] h-[1em] bg-primary ml-1"></span>
    </div>
  );
};

export default TypingEffect;