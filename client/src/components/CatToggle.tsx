import { useState, useEffect, useRef } from 'react';
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

  // Create transition animation for the entire page
  document.body.classList.add('theme-transition');
  
  // Apply the colors
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Add class to body for CSS selectors
  document.body.classList.toggle('light-theme', theme === 'light');
  document.body.classList.toggle('dark-theme', theme === 'dark');
  
  // Remove transition class after animation completes
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 1000);
  
  // Store the user's preference
  localStorage.setItem('theme', theme);
};

// Sound effects
const playSoundEffect = (soundName: string) => {
  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.3; // Set volume to 30%
    audio.play();
  } catch (error) {
    console.log('Sound effect not available');
  }
};

// Cat phrases for different moods
const catPhrases = {
  dark: [
    "Night mode activated!",
    "Purr-fect darkness...",
    "Meow-gical night mode!",
    "Cats love the night!"
  ],
  light: [
    "Hello sunshine!",
    "Day mode meow!",
    "Bright and purr-fect!",
    "Time to play!"
  ],
  game: [
    "Catch me if you can!",
    "Let's play!",
    "I'm faster than you!",
    "Meow-velous moves!",
    "Too slow, human!"
  ]
};

// Get random phrase
const getRandomPhrase = (type: 'dark' | 'light' | 'game') => {
  const phrases = catPhrases[type];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

const CatToggle = () => {
  const [isDark, setIsDark] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isCatAwake, setIsCatAwake] = useState(true);
  const [catPhrase, setCatPhrase] = useState('');
  const [showPhrase, setShowPhrase] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameMisses, setGameMisses] = useState(0);

  const toggleRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable.Vars | null>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize theme, draggable, and sounds
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setIsDark(savedTheme === 'dark');
    applyTheme(savedTheme);
    
    // Preload sound effects
    const soundEffects = ['meow', 'purr', 'switch', 'pop', 'game'];
    soundEffects.forEach(sound => {
      const audio = new Audio();
      audio.src = `/sounds/${sound}.mp3`;
    });
    
    // Show initial cat
    setTimeout(() => {
      showCatPhrase('light');
    }, 2000);
    
    // Setup draggable behavior
    if (toggleRef.current) {
      // Initial animation - make sure the cat is visible
      gsap.fromTo(toggleRef.current, 
        { y: -100, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
      );
      
      // Make it draggable but limit its movement to the viewport
      draggableRef.current = Draggable.create(toggleRef.current, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: {
          minX: -10,
          maxX: window.innerWidth - 100,
          minY: -10,
          maxY: window.innerHeight - 100
        },
        inertia: true,
        onDragStart: function() {
          // Wake up the cat when being dragged
          setIsCatAwake(true);
          
          // Show game phrase on drag
          if (!gameActive) {
            showCatPhrase('game');
          }
          
          // Play sound effect
          playSoundEffect('meow');
        },
        onDragEnd: function() {
          // Save position to state
          if (this.x !== undefined && this.y !== undefined) {
            setPosition({ x: this.x, y: this.y });
          }
          
          // The cat goes back to sleep after some time
          setTimeout(() => {
            setIsCatAwake(false);
          }, 5000);
        }
      })[0];
      
      // Add window resize handler to keep cat in bounds
      const handleResize = () => {
        if (draggableRef.current) {
          draggableRef.current.update();
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        // Clean up game if active
        if (gameTimerRef.current) {
          clearTimeout(gameTimerRef.current);
        }
      };
    }
  }, []);
  
  // Show cat phrase with animation
  const showCatPhrase = (type: 'dark' | 'light' | 'game') => {
    const phrase = getRandomPhrase(type);
    setCatPhrase(phrase);
    setShowPhrase(true);
    
    // Hide phrase after a few seconds
    setTimeout(() => {
      setShowPhrase(false);
    }, 3000);
  };
  
  // Toggle theme with animation
  const toggleTheme = () => {
    // Don't toggle during active game
    if (gameActive) return;
    
    const newTheme = isDark ? 'light' : 'dark';
    
    // Wake up the cat
    setIsCatAwake(true);
    
    // Show appropriate phrase
    showCatPhrase(newTheme);
    
    // Play sound effect
    playSoundEffect('switch');
    
    // Create page-wide transition effect
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 pointer-events-none z-[9999]';
    overlay.style.background = newTheme === 'light' 
      ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)' 
      : 'radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)';
    overlay.style.opacity = '0';
    document.body.appendChild(overlay);
    
    // Animate the cat
    if (catRef.current) {
      gsap.to(catRef.current, {
        rotate: isDark ? 360 : -360,
        scale: 1.2,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to(catRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "back.out",
          });
          
          // The cat goes back to sleep after theme change
          setTimeout(() => {
            setIsCatAwake(false);
          }, 5000);
        }
      });
    }
    
    // Animate the overlay
    gsap.to(overlay, {
      opacity: 0.8,
      duration: 0.5,
      onComplete: () => {
        // Change theme
        setIsDark(!isDark);
        applyTheme(newTheme);
        
        // Fade out overlay
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            document.body.removeChild(overlay);
          }
        });
      }
    });
  };
  
  // Double-click to start a mini-game
  const handleDoubleClick = () => {
    if (gameActive) return;
    
    // Start the catch-the-cat game
    setGameActive(true);
    setGameScore(0);
    setGameMisses(0);
    
    // Play game start sound
    playSoundEffect('game');
    
    // Show game start phrase
    showCatPhrase('game');
    
    // Schedule random movement
    scheduleRandomMove();
  };
  
  // Schedule random movement for the game
  const scheduleRandomMove = () => {
    // Clear existing timer
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
    }
    
    // Schedule next move
    gameTimerRef.current = setTimeout(() => {
      if (!toggleRef.current || !gameActive) return;
      
      // Calculate random position within viewport
      const maxX = window.innerWidth - 150;
      const maxY = window.innerHeight - 150;
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;
      
      // Animate the cat to a new position
      gsap.to(toggleRef.current, {
        x: randomX,
        y: randomY,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Update state position
          setPosition({ x: randomX, y: randomY });
          
          // Meow sound occasionally
          if (Math.random() > 0.7) {
            playSoundEffect('meow');
          }
          
          // End game after 10 successful catches or 5 misses
          if (gameScore >= 10 || gameMisses >= 5) {
            endGame();
          } else {
            // Schedule next move
            scheduleRandomMove();
          }
        }
      });
      
      // Increment misses if not caught
      setGameMisses(prev => prev + 1);
      
    }, Math.random() * 500 + 1000); // Random delay between 1-1.5 seconds
  };
  
  // Cat successfully caught
  const handleCatCatch = (e: React.MouseEvent) => {
    if (!gameActive) return;
    
    e.stopPropagation();
    
    // Increment score
    setGameScore(prev => prev + 1);
    
    // Decrement misses (caught the cat!)
    setGameMisses(prev => Math.max(0, prev - 1));
    
    // Play sound
    playSoundEffect('pop');
    
    // Show celebration phrase
    showCatPhrase('game');
    
    // Visual feedback for successful catch
    if (catRef.current) {
      gsap.to(catRef.current, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }
  };
  
  // End the game
  const endGame = () => {
    setGameActive(false);
    
    // Final score message
    setCatPhrase(`Game over! Score: ${gameScore}/10`);
    setShowPhrase(true);
    
    // Play appropriate sound
    if (gameScore >= 8) {
      playSoundEffect('purr'); // Great score
    } else {
      playSoundEffect('meow'); // OK score
    }
    
    // Hide phrase after a delay
    setTimeout(() => {
      setShowPhrase(false);
    }, 3000);
    
    // Clear any pending timers
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
      gameTimerRef.current = null;
    }
  };
  
  return (
    <>
      {/* Main toggle container */}
      <div 
        ref={toggleRef}
        className="fixed z-50 select-none"
        style={{ 
          top: '100px',
          right: '20px',
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          cursor: gameActive ? 'grab' : 'move',
          touchAction: 'none'
        }}
        onDoubleClick={handleDoubleClick}
        onClick={gameActive ? handleCatCatch : toggleTheme}
      >
        {/* Cat toggle button */}
        <div 
          ref={catRef}
          className="w-20 h-20 relative transition-all duration-300"
          style={{
            filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))`,
          }}
        >
          {/* Cat face for dark mode - awake */}
          {isDark && isCatAwake && (
            <div className="cat-face dark-awake">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="#333" />
                <circle cx="40" cy="40" r="32" fill="#222" />
                <path d="M28 28L20 20M52 28L60 20" stroke="#5B5B5B" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="35" r="4" fill="#3a86ff" />
                <circle cx="50" cy="35" r="4" fill="#3a86ff" />
                <path d="M35 45C35 47.7614 37.2386 50 40 50C42.7614 50 45 47.7614 45 45" stroke="#5B5B5B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          
          {/* Cat face for dark mode - sleepy */}
          {isDark && !isCatAwake && (
            <div className="cat-face dark-sleepy">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="#333" />
                <circle cx="40" cy="40" r="32" fill="#222" />
                <path d="M28 28L20 20M52 28L60 20" stroke="#5B5B5B" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 35H32" stroke="#5B5B5B" strokeWidth="2" strokeLinecap="round" />
                <path d="M48 35H52" stroke="#5B5B5B" strokeWidth="2" strokeLinecap="round" />
                <path d="M35 50C35 52.7614 37.2386 55 40 55C42.7614 55 45 52.7614 45 50" stroke="#5B5B5B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          
          {/* Cat face for light mode - awake */}
          {!isDark && isCatAwake && (
            <div className="cat-face light-awake">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="#f0f0f0" />
                <circle cx="40" cy="40" r="32" fill="#ffffff" />
                <path d="M28 28L20 20M52 28L60 20" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="35" r="4" fill="#ff006e" />
                <circle cx="50" cy="35" r="4" fill="#ff006e" />
                <path d="M35 45C35 47.7614 37.2386 50 40 50C42.7614 50 45 47.7614 45 45" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          
          {/* Cat face for light mode - sleepy */}
          {!isDark && !isCatAwake && (
            <div className="cat-face light-sleepy">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="#f0f0f0" />
                <circle cx="40" cy="40" r="32" fill="#ffffff" />
                <path d="M28 28L20 20M52 28L60 20" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 35H32" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" />
                <path d="M48 35H52" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" />
                <path d="M35 50C35 52.7614 37.2386 55 40 55C42.7614 55 45 52.7614 45 50" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          
          {/* Glow effect for active state */}
          <div 
            className="absolute inset-0 rounded-full animate-glow -z-10" 
            style={{
              filter: 'blur(8px)',
              opacity: isCatAwake ? 0.6 : 0.2,
              background: isDark 
                ? 'radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 100%)' 
                : 'radial-gradient(circle, var(--color-secondary) 0%, var(--color-primary) 100%)'
            }}
          />
          
          {/* Game indicator */}
          {gameActive && (
            <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {gameScore}
            </div>
          )}
        </div>
        
        {/* Speech bubble */}
        {showPhrase && (
          <div 
            className="absolute top-0 -left-3 transform -translate-x-full animate-fadeIn"
            style={{
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              color: isDark ? '#ffffff' : '#000000',
              backdropFilter: 'blur(4px)',
              padding: '8px 14px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              maxWidth: '180px',
              whiteSpace: 'normal',
              fontSize: '0.875rem',
              zIndex: 60
            }}
          >
            <div 
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3"
              style={{
                backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              }}
            />
            <div>{catPhrase}</div>
          </div>
        )}
        
        {/* Tooltip */}
        {!showPhrase && !gameActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 rounded text-[10px] opacity-60 whitespace-nowrap" 
            style={{
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
              color: isDark ? '#ffffff' : '#000000',
            }}>
            Click to toggle • Double-click for game
          </div>
        )}
      </div>
    </>
  );
};

export default CatToggle;