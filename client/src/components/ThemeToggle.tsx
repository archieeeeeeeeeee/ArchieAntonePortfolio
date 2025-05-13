import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Code, Terminal, MonitorSmartphone } from 'lucide-react';
import gsap from 'gsap';

const themes = {
  dark: {
    background: '#121212',
    text: '#fafafa',
    primary: '#3a86ff',
    secondary: '#ff006e',
    accent: '#ffbe0b',
    cardBg: 'rgba(30, 30, 30, 0.8)',
    border: 'rgba(75, 85, 99, 0.3)',
  },
  light: {
    background: '#f5f5f5',
    text: '#121212',
    primary: '#1a6cdf',
    secondary: '#d1004e',
    accent: '#ffa500',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(75, 85, 99, 0.2)',
  },
};

// Update CSS variables with theme colors
const applyTheme = (theme: 'dark' | 'light') => {
  const root = document.documentElement;
  const colors = themes[theme];

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Add class to body for CSS selectors
  document.body.classList.toggle('light-theme', theme === 'light');
  document.body.classList.toggle('dark-theme', theme === 'dark');
  
  // Store the user's preference
  localStorage.setItem('theme', theme);
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const iconContainerRef = useRef<HTMLDivElement>(null);
  const floatingTl = useRef<gsap.core.Timeline | null>(null);
  
  // Initialize theme
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setIsDark(savedTheme === 'dark');
    applyTheme(savedTheme);
    
    // Initialize entry animation
    if (buttonRef.current) {
      gsap.from(buttonRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.4
      });
    }
    
    // Setup floating animation
    startFloatingAnimation();
    
    // Add scroll listener to adjust position
    const handleScroll = () => {
      if (buttonRef.current) {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollY / maxScroll;
        
        // Max vertical movement of 40vh
        const maxMove = window.innerHeight * 0.4;
        const newY = 100 + (scrollPercentage * maxMove);
        
        gsap.to(buttonRef.current, { 
          y: newY,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Setup floating animation
  const startFloatingAnimation = () => {
    if (!buttonRef.current) return;
    
    // Cancel existing animation if already running
    if (floatingTl.current) {
      floatingTl.current.kill();
    }
    
    // Create floating animation
    floatingTl.current = gsap.timeline({ repeat: -1, yoyo: true });
    floatingTl.current
      .to(buttonRef.current, {
        y: '+=10',
        duration: 1.5,
        ease: 'sine.inOut'
      })
      .to(buttonRef.current, {
        y: '-=10',
        duration: 1.5,
        ease: 'sine.inOut'
      });
  };
  
  // Toggle theme with animation
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    
    // Create particle effects
    createParticles();
    
    // Pause floating animation during theme change
    if (floatingTl.current) {
      floatingTl.current.pause();
    }
    
    // Animate the toggle with a more elaborate sequence
    if (iconContainerRef.current && buttonRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDark(!isDark);
          applyTheme(newTheme);
          
          // Resume floating animation
          if (floatingTl.current) {
            floatingTl.current.resume();
          }
        }
      });
      
      tl.to(buttonRef.current, {
        scale: 1.2,
        duration: 0.3,
        ease: 'back.out(1.7)',
      })
      .to(iconContainerRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: 'power2.inOut',
      }, "-=0.1")
      .to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out',
      });
    } else {
      setIsDark(!isDark);
      applyTheme(newTheme);
    }
  };
  
  // Create particle effects during theme toggle
  const createParticles = () => {
    const container = document.createElement('div');
    container.className = 'absolute inset-0 pointer-events-none overflow-hidden';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = isDark 
        ? `hsl(${Math.random() * 60 + 40}, 100%, 60%)` 
        : `hsl(${Math.random() * 60 + 220}, 100%, 60%)`;
      particle.style.left = `${buttonRef.current?.getBoundingClientRect().left || 0}px`;
      particle.style.top = `${buttonRef.current?.getBoundingClientRect().top || 0}px`;
      
      container.appendChild(particle);
      particles.push(particle);
      
      gsap.to(particle, {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        opacity: 0,
        scale: 0,
        duration: Math.random() * 1 + 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (container && container.parentNode) {
            container.removeChild(particle);
            if (container.childNodes.length === 0) {
              document.body.removeChild(container);
            }
          }
        }
      });
    }
  };
  
  // Handle hover state
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Pause floating animation during hover
    if (floatingTl.current) {
      floatingTl.current.pause();
    }
    
    // Scale up the button
    gsap.to(buttonRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: 'back.out',
    });
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Resume floating animation after hover
    if (floatingTl.current) {
      floatingTl.current.resume();
    }
    
    // Scale back to normal size
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'back.out',
    });
    
    // Collapse expanded button
    setIsExpanded(false);
  };
  
  // Handle button click to expand
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    
    if (!isExpanded) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    } else {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'back.in',
      });
    }
  };
  
  return (
    <div 
      ref={buttonRef}
      className="fixed right-6 top-24 z-50 select-none"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Main Theme Toggle Button */}
      <div
        className="cursor-pointer flex items-center shadow-lg transition-all duration-300 overflow-hidden"
        style={{ 
          backgroundColor: isDark 
            ? 'rgba(30, 30, 30, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          color: isDark ? '#ffffff' : '#000000',
          borderRadius: '50px',
          border: isDark 
            ? '2px solid rgba(58, 134, 255, 0.5)' 
            : '2px solid rgba(26, 108, 223, 0.5)',
          padding: isExpanded ? '12px 20px' : '12px',
          width: isExpanded ? 'auto' : '48px',
          boxShadow: isHovered 
            ? `0 0 20px ${isDark ? 'rgba(58, 134, 255, 0.5)' : 'rgba(26, 108, 223, 0.5)'}` 
            : `0 4px 15px rgba(0, 0, 0, 0.2)`,
          transition: 'all 0.3s ease-in-out'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleExpandClick}
      >
        <div className="p-1 rounded-full" style={{ 
          backgroundColor: isDark 
            ? 'rgba(58, 134, 255, 0.3)' 
            : 'rgba(26, 108, 223, 0.1)'
        }}>
          <div ref={iconContainerRef} className="flex items-center justify-center">
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </div>
        </div>
        
        {/* Expanded content */}
        <div 
          className="overflow-hidden transition-all duration-300"
          style={{ 
            maxWidth: isExpanded ? '200px' : '0',
            opacity: isExpanded ? 1 : 0,
            marginLeft: isExpanded ? '10px' : '0'
          }}
        >
          <div className="whitespace-nowrap text-sm font-medium">
            Switch to {isDark ? 'Light' : 'Dark'} Mode
          </div>
        </div>
        
        {/* Coding symbol floating decoration */}
        <div 
          className="absolute -top-2 -right-2 text-xs animate-pulse"
          style={{ 
            color: isDark ? 'var(--color-primary)' : 'var(--color-secondary)',
            zIndex: 2
          }}
        >
          {isDark ? <Code className="h-3 w-3" /> : <Terminal className="h-3 w-3" />}
        </div>
      </div>
      
      {/* Switch button that appears when expanded */}
      {isExpanded && (
        <button
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer rounded-full p-3 transition-all duration-300"
          style={{ 
            backgroundColor: isDark 
              ? 'rgba(255, 0, 110, 0.8)' 
              : 'rgba(26, 108, 223, 0.8)',
            boxShadow: `0 4px 15px ${isDark ? 'rgba(255, 0, 110, 0.5)' : 'rgba(26, 108, 223, 0.5)'}`
          }}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <MonitorSmartphone className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;