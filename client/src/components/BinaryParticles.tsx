import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@/lib/useGSAP';
import gsap from 'gsap';

interface BinaryParticlesProps {
  particleCount?: number;
  className?: string;
}

const BinaryParticles = ({ 
  particleCount = 50,
  className = ""
}: BinaryParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  useGSAP();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set the canvas dimensions to match its display size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Binary particle class
    class BinaryParticle {
      x: number;
      y: number;
      size: number;
      value: string;
      color: string;
      speed: number;
      opacity: number;
      valueChangeInterval: number;
      lastValueChange: number;
      canvasWidth: number;
      canvasHeight: number;
      
      constructor(x: number, y: number, size: number, canvasWidth: number, canvasHeight: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.value = Math.random() > 0.5 ? '1' : '0';
        this.color = isDarkTheme ? 
          'rgba(58, 134, 255, 0.7)' : 
          'rgba(26, 108, 223, 0.7)';
        this.speed = Math.random() * 1 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.valueChangeInterval = Math.random() * 1000 + 500;
        this.lastValueChange = Date.now();
      }
      
      update(currentWidth: number, currentHeight: number) {
        // Update canvas dimensions reference if changed
        this.canvasWidth = currentWidth;
        this.canvasHeight = currentHeight;
        
        this.y += this.speed;
        
        // Reset position when particle goes off screen
        if (this.y > this.canvasHeight) {
          this.y = 0 - this.size;
          this.x = Math.random() * this.canvasWidth;
        }
        
        // Randomly change the binary value
        const now = Date.now();
        if (now - this.lastValueChange > this.valueChangeInterval) {
          this.value = Math.random() > 0.5 ? '1' : '0';
          this.lastValueChange = now;
        }
      }
      
      draw(context: CanvasRenderingContext2D) {
        context.font = `${this.size}px "Courier New", monospace`;
        context.fillStyle = this.color;
        context.globalAlpha = this.opacity;
        context.fillText(this.value, this.x, this.y);
        context.globalAlpha = 1;
      }
    }
    
    // Create particles
    const particles: BinaryParticle[] = [];
    
    if (canvas) {
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 12 + 10;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new BinaryParticle(x, y, size, canvas.width, canvas.height));
      }
    }
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Update colors on theme change
    const updateTheme = () => {
      const newIsDarkTheme = !document.body.classList.contains('light-theme');
      setIsDarkTheme(newIsDarkTheme);
      
      particles.forEach(particle => {
        particle.color = newIsDarkTheme ? 
          'rgba(58, 134, 255, 0.7)' : 
          'rgba(26, 108, 223, 0.7)';
      });
    };
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          updateTheme();
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Initial animation
    gsap.from(canvas, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, isDarkTheme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
};

export default BinaryParticles;