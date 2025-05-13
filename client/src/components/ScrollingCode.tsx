import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

interface ScrollingCodeProps {
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

const ScrollingCode = ({ 
  direction = 'left', 
  speed = 30,
  className = ''
}: ScrollingCodeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Sample code snippets
  const codeSnippets = [
    `function animateElements() {
  gsap.from(elements, {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 1
  });
}`,
    `const data = fetch('/api/projects')
  .then(res => res.json())
  .then(data => renderProjects(data));`,
    `class DeveloperPortfolio {
  constructor() {
    this.init();
  }
  
  init() {
    this.createAnimations();
    this.bindEvents();
  }
}`,
    `document.querySelectorAll('.project')
  .forEach(project => {
    project.addEventListener('mouseenter', 
      handleProjectHover);
  });`,
    `import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  return { theme, setTheme };
}`
  ];
  
  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    
    // Clone track to create infinite effect
    const track = trackRef.current;
    const trackWidth = track.offsetWidth;
    const trackClone = track.cloneNode(true);
    containerRef.current.appendChild(trackClone);
    
    // Set initial position
    if (direction === 'left') {
      gsap.set(trackClone, { left: trackWidth });
    } else {
      gsap.set(track, { left: trackWidth });
      gsap.set(trackClone, { left: 0 });
    }
    
    // Create animation
    const duration = trackWidth / (speed * (isMobile ? 0.5 : 1));
    const directionMultiplier = direction === 'left' ? -1 : 1;
    
    // Animate the tracks
    gsap.to([track, trackClone], {
      x: directionMultiplier * trackWidth,
      duration,
      repeat: -1,
      ease: "none",
      modifiers: {
        x: (x) => {
          // Reset position when track is out of view
          const newX = parseFloat(x);
          return `${newX % trackWidth}px`;
        }
      }
    });
    
    return () => {
      gsap.killTweensOf([track, trackClone]);
    };
  }, [direction, speed, isMobile]);
  
  return (
    <div 
      ref={containerRef}
      className={`code-scroll-container relative overflow-hidden whitespace-nowrap ${className}`}
    >
      <div 
        ref={trackRef}
        className="code-scroll-track inline-block"
      >
        {codeSnippets.map((snippet, index) => (
          <div 
            key={index}
            className="inline-block bg-dark/80 border border-gray-700 rounded-md p-3 mx-4 align-top"
          >
            <pre className="text-xs md:text-sm font-mono overflow-x-auto max-w-xs md:max-w-md whitespace-pre-wrap">
              <code className="text-light">
                {snippet}
              </code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingCode;