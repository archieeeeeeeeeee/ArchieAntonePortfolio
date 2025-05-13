import { useEffect, useRef } from 'react';
import { FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaGithub, FaDatabase, FaPhp } from 'react-icons/fa';
import { SiMysql, SiTailwindcss } from 'react-icons/si';
import gsap from 'gsap';

interface FloatingIconsProps {
  count?: number;
}

const FloatingIcons = ({ count = 20 }: FloatingIconsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const icons = containerRef.current.querySelectorAll('.floating-icon');
    
    // Initialize icons with random positions
    icons.forEach((icon) => {
      const x = Math.random() * 100; // position as percentage of container width
      const y = Math.random() * 100; // position as percentage of container height
      const rotation = Math.random() * 360;
      const scale = 0.5 + Math.random() * 0.5;
      const duration = 10 + Math.random() * 20;
      
      gsap.set(icon, {
        x: `${x}%`,
        y: `${y}%`,
        rotation,
        scale
      });
      
      // Random floating animation
      animateIcon(icon as HTMLElement, duration);
    });
    
    function animateIcon(icon: HTMLElement, duration: number) {
      // Calculate new random position
      const newX = Math.random() * 100;
      const newY = Math.random() * 100;
      const newRotation = Math.random() * 360;
      
      // Animate to new position
      gsap.to(icon, {
        x: `${newX}%`,
        y: `${newY}%`,
        rotation: newRotation,
        duration,
        ease: "sine.inOut",
        onComplete: () => animateIcon(icon, duration) // Continuous animation
      });
    }
    
    return () => {
      // Cleanup animations
      icons.forEach((icon) => {
        gsap.killTweensOf(icon);
      });
    };
  }, [count]);
  
  // Array of tech icons
  const iconComponents = [
    FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, 
    FaGithub, FaDatabase, FaPhp, SiMysql, SiTailwindcss
  ];
  
  // Generate random icons
  const generateIcons = () => {
    const icons = [];
    
    for (let i = 0; i < count; i++) {
      const IconComponent = iconComponents[i % iconComponents.length];
      const size = Math.floor(Math.random() * 20) + 20; // 20px to 40px
      const opacity = 0.1 + Math.random() * 0.2; // 0.1 to 0.3
      
      icons.push(
        <div 
          key={i}
          className="floating-icon absolute"
          style={{ opacity }}
        >
          <IconComponent size={size} className="text-primary" />
        </div>
      );
    }
    
    return icons;
  };
  
  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-[-1] overflow-hidden pointer-events-none"
    >
      {generateIcons()}
    </div>
  );
};

export default FloatingIcons;