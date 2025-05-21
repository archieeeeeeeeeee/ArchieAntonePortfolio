import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Code, Terminal, Sparkles, Lightbulb, Palette } from 'lucide-react';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

// Register GSAP plugins
gsap.registerPlugin(Draggable);

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toggleRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLButtonElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable.Vars | null>(null);
  const lastTap = useRef<number>(0);
  
  // Initialize theme and draggable
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setIsDark(savedTheme === 'dark');
    applyTheme(savedTheme);
    
    // Setup draggable behavior
    if (toggleRef.current) {
      // Initial animation
      gsap.fromTo(toggleRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
      );
      
      // Make it draggable
      draggableRef.current = Draggable.create(toggleRef.current, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: window,
        inertia: true,
        onDragEnd: function() {
          // Save position to state
          if (this.x !== undefined && this.y !== undefined) {
            setPosition({ x: this.x, y: this.y });
          }
        }
      })[0];
    }
    
    // Set up rotating orbit effect
    if (orbitRef.current) {
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }
    
    return () => {
      // Clean up
      if (draggableRef.current) {
        draggableRef.current.kill();
      }
    };
  }, []);
  
  /*
  // Toggle theme with animation
  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const newTheme = isDark ? 'light' : 'dark';
    
    // Create particle explosion
    createParticleExplosion();
    
    // Animate the toggle button
    if (switchRef.current) {
      // Disable dragging temporarily
      if (draggableRef.current) {
        draggableRef.current.disable();
      }
      
      // Create cool rotation animation
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDark(!isDark);
          applyTheme(newTheme);
          
          // Re-enable dragging
          if (draggableRef.current) {
            draggableRef.current.enable();
          }
        }
      });
      
      tl.to(switchRef.current, {
        scale: 1.5,
        duration: 0.3,
        ease: "back.out(2)",
      })
      .to(switchRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: "power1.inOut"
      }, "-=0.1")
      .to(switchRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1)",
      });
    } else {
      setIsDark(!isDark);
      applyTheme(newTheme);
    }
  };
  */
  
  // Create particle explosion effect
  const createParticleExplosion = () => {
    if (!toggleRef.current) return;
    
    // Get the button's position
    const rect = toggleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create a container for the particles
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(container);
    
    // Create particles
    const particleCount = 24;
    const colors = isDark ? 
      ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'] : 
      ['#3a86ff', '#8338ec', '#ff006e', '#fb5607', '#ffbe0b'];
    
    for (let i = 0; i < particleCount; i++) {
      // Create particle element
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      
      // Random size between 6px and 12px
      const size = Math.random() * 6 + 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random color from our palette
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Position at the center of the button
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      
      // Add to DOM
      container.appendChild(particle);
      
      // Calculate random angle and distance
      const angle = Math.random() * Math.PI * 2; // 0 to 2π
      const distance = 60 + Math.random() * 80; // 60px to 140px
      
      // Calculate end position based on angle and distance
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      // Animate the particle
      gsap.to(particle, {
        x: endX,
        y: endY,
        opacity: 0,
        duration: 1 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => {
          container.removeChild(particle);
          if (container.childNodes.length === 0) {
            document.body.removeChild(container);
          }
        }
      });
    }
  };
  
  // Handle double tap on mobile
  const handleTap = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap.current;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      e.preventDefault();
      // toggleTheme(e as unknown as React.MouseEvent);
    }
    
    lastTap.current = currentTime;
  };
  
  // Generate spinning orbit items
  const renderOrbitItems = () => {
    const items = [];
    const totalItems = 5;
    
    for (let i = 0; i < totalItems; i++) {
      const angle = (i / totalItems) * Math.PI * 2;
      const x = Math.cos(angle) * 30; // 30px radius
      const y = Math.sin(angle) * 30;
      
      items.push(
        <div 
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary animate-pulse-slow"
          style={{
            transform: `translate(${x}px, ${y}px)`,
            opacity: 0.6 + (i / totalItems) * 0.4,
            backgroundColor: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'
          }}
        />
      );
    }
    
    return items;
  };
  
  return (
    <div 
      ref={toggleRef}
      className="fixed z-50 cursor-move select-none"
      style={{ 
        top: '100px',
        right: '20px',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none' // Prevents default touch actions on mobile
      }}
      onTouchEnd={handleTap}
    >
      {/* Animated orbit decoration */}
      <div ref={orbitRef} className="absolute inset-0 pointer-events-none">
        {renderOrbitItems()}
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full animate-glow" 
        style={{
          filter: 'blur(10px)',
          opacity: 0.4,
          background: isDark 
            ? 'radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 100%)' 
            : 'radial-gradient(circle, var(--color-secondary) 0%, var(--color-primary) 100%)'
        }}
      />
      
      {/* Main toggle button */}
      <button
        ref={switchRef}
        className="w-16 h-16 rounded-full flex items-center justify-center relative z-10 border-4"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #121212 0%, #1e1e2a 100%)' 
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          borderColor: isDark 
            ? 'rgba(58, 134, 255, 0.6)' 
            : 'rgba(26, 108, 223, 0.6)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}
        // onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {isDark ? (
            <Sun className="h-8 w-8 text-yellow-300 animate-pulse-slow" />
          ) : (
            <Moon className="h-8 w-8 text-indigo-600 animate-pulse-slow" />
          )}
        </div>
        
        {/* Small decorative icons floating around */}
        <div className="absolute -top-2 -right-2 text-xs animate-pulse-slow">
          <Sparkles className="h-4 w-4" style={{ color: isDark ? '#ffbe0b' : '#3a86ff' }} />
        </div>
        <div className="absolute -bottom-2 -left-2 text-xs animate-pulse-slow">
          <Palette className="h-4 w-4" style={{ color: isDark ? '#ff006e' : '#d1004e' }} />
        </div>
      </button>
      
      {/* Tooltip/hint */}
      <div 
        className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-opacity-80 px-3 py-1 rounded text-xs font-medium pointer-events-none"
        style={{
          backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          color: isDark ? '#ffffff' : '#000000',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          opacity: 0.9
        }}
      >
        Drag me or click to toggle theme
      </div>
    </div>
  );
};

export default ThemeToggle;
