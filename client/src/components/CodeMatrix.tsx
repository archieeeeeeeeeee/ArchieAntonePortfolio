import { useEffect, useRef } from "react";

interface CodeMatrixProps {
  density?: number;
}

const CodeMatrix = ({ density = 50 }: CodeMatrixProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Define characters to use
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}()-_+=*/\\|~;:,.?!@#$%^&";
    
    // Create drops
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100); // Random starting positions above the canvas
    }
    
    // Generate code function
    const generateCode = () => {
      return Array.from({ length: Math.floor(Math.random() * 10) + 3 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    };
    
    // Colors for the matrix effect
    const primaryColor = "#3a86ff";
    const secondaryColor = "#ff006e";
    const tertiaryColor = "#8338ec";
    
    // Draw the matrix
    const draw = () => {
      // Semi-transparent black background to create trail effect
      ctx.fillStyle = "rgba(18, 18, 18, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Draw random character
        const text = generateCode();
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Determine color based on position
        const colorRange = Math.sin(i / 10) * 0.5 + 0.5;
        if (colorRange < 0.33) {
          ctx.fillStyle = primaryColor;
        } else if (colorRange < 0.66) {
          ctx.fillStyle = secondaryColor;
        } else {
          ctx.fillStyle = tertiaryColor;
        }
        
        // Draw the character
        if (y > 0) {
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
        }
        
        // Move drops down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Increment y coordinate
        drops[i]++;
      }
    };
    
    // Animation loop
    const interval = setInterval(draw, 50);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [density]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-[-2] opacity-30"
    />
  );
};

export default CodeMatrix;