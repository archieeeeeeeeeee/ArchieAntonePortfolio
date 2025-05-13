import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const ParticlesCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    // Set initial canvas size
    handleResize();

    // Particle class
    class Particle implements Particle {
      constructor(
        public x: number,
        public y: number,
        public size: number,
        public speedX: number,
        public speedY: number,
        public color: string
      ) {}

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;

        if (this.x < 0 || this.x > (canvas?.width || 0)) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > (canvas?.height || 0)) this.speedY = -this.speedY;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    const particlesArray: Particle[] = [];
    const numberOfParticles = 100;

    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * (canvas?.width || 0);
      const y = Math.random() * (canvas?.height || 0);
      const size = Math.random() * 5 + 1;
      const speedX = Math.random() * 1 - 0.5;
      const speedY = Math.random() * 1 - 0.5;
      const color = `rgba(58, 134, 255, ${Math.random() * 0.5})`;

      particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="absolute top-0 left-0 w-full h-full z-[-1]"
    />
  );
};

export default ParticlesCanvas;
