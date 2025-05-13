import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Code, Terminal } from 'lucide-react';
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
    primary: '#3a86ff',
    secondary: '#ff006e',
    accent: '#ffbe0b',
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize theme
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setIsDark(savedTheme === 'dark');
    applyTheme(savedTheme);
    
    // Initialize button animation
    if (buttonRef.current) {
      gsap.from(buttonRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out',
        delay: 0.2
      });
    }
  }, []);
  
  // Toggle theme with animation
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    
    // Animate the toggle
    if (iconContainerRef.current) {
      // Rotation animation
      gsap.to(iconContainerRef.current, {
        rotateY: 180,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsDark(!isDark);
          applyTheme(newTheme);
          
          // Reset rotation after theme change
          gsap.set(iconContainerRef.current, { rotateY: 0 });
        }
      });
    } else {
      setIsDark(!isDark);
      applyTheme(newTheme);
    }
  };
  
  return (
    <button
      ref={buttonRef}
      className="theme-toggle fixed top-4 right-4 z-50 transition-all duration-300 rounded-lg"
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
        color: isDark ? '#ffffff' : '#000000',
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
      }}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <div ref={iconContainerRef} className="relative">
        {isDark ? (
          <div className="flex items-center">
            <Sun className="h-5 w-5 text-yellow-300" />
            <span className="ml-2 text-sm font-medium text-white">Light Mode</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Moon className="h-5 w-5 text-indigo-600" />
            <span className="ml-2 text-sm font-medium">Dark Mode</span>
          </div>
        )}
        
        {/* Coding symbol decoration */}
        <div className="absolute -top-2 -right-2 text-xs" style={{ color: 'var(--color-primary)' }}>
          {isDark ? <Code className="h-3 w-3" /> : <Terminal className="h-3 w-3" />}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;