import { useEffect, useRef, useState } from "react";
import { ChevronDown, Code, Terminal, Github, Linkedin } from "lucide-react";
import gsap from "gsap";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import CodeMatrix from "@/components/CodeMatrix";
import TypingEffect from "@/components/TypingEffect";
import CubeScene from "@/components/CubeScene";
import FloatingIcons from "@/components/FloatingIcons";
import Terrain3D from "@/components/Terrain3D";
import BinaryParticles from "@/components/BinaryParticles";
import CodeSphere from "@/components/CodeSphere";
import { SOCIAL_LINKS } from "@/constants";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initialize terminal animation after a delay
    setTimeout(() => {
      setShowTerminal(true);
    }, 800);

    // Hero content animation with staggered effect
    if (contentRef.current) {
      const heroItems = contentRef.current.querySelectorAll('.hero-anim-item');
      if (heroItems.length > 0) {
        tl.from(heroItems, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.5,
        });
      }
    }

    // Bounce animation for chevron
    gsap.to(chevronRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "sine.inOut",
    });

    // Create a random animation for the blobs
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach(blob => {
      gsap.to(blob, {
        x: gsap.utils.random(-20, 20),
        y: gsap.utils.random(-20, 20),
        rotation: gsap.utils.random(-10, 10),
        duration: gsap.utils.random(5, 10),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    
    // Create the glitch effect for hero title
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
      const glitchTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 5,
      });
      
      // Add glitch effect
      glitchTl.to(glitchText, {
        skewX: 20,
        duration: 0.1,
        ease: "power3.inOut",
      })
      .to(glitchText, {
        skewX: 0,
        duration: 0.1,
        ease: "power3.inOut",
      })
      .to(glitchText, {
        opacity: 0.8,
        duration: 0.1,
      })
      .to(glitchText, {
        opacity: 1,
        duration: 0.1,
      })
      .to(glitchText, {
        x: -10,
        duration: 0.1,
      })
      .to(glitchText, {
        x: 0,
        duration: 0.1,
      });
    }
    
    // Create spotlight effect on mouse move
    const spotlight = document.querySelector('.spotlight');
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlight) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        gsap.to(spotlight, {
          '--x': `${x * 100}%`,
          '--y': `${y * 100}%`,
          duration: 0.5,
          ease: "power1.out",
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    
    if (aboutSection) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: aboutSection, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  // Developer typing effect words
  const developerTypeWords = [
    "Full-Stack Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Code Enthusiast",
    "Web Developer"
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D animated background */}
      <Terrain3D opacity={0.15} />
      
      {/* Matrix code effect */}
      <CodeMatrix density={50} />
      
      {/* Binary particles - new theme-compatible effect */}
      <div className="absolute inset-0 z-0 opacity-15">
        <BinaryParticles particleCount={40} />
      </div>
      
      {/* Particles and floating tech icons */}
      <ParticlesCanvas />
      <FloatingIcons count={15} />
      
      {/* Code Sphere animation - theme compatible */}
      <div className="absolute -left-20 top-1/3 hidden xl:block">
        <CodeSphere size={200} position={{ x: 0, y: 0 }} opacity={0.4} />
      </div>
      
      {/* Blob accents with theme-compatible colors */}
      <div className="blob absolute w-64 h-64 top-20 -left-20 rounded-full" 
        style={{ backgroundColor: 'var(--color-primary)', opacity: 0.15 }}></div>
      <div className="blob absolute w-80 h-80 bottom-10 right-10 rounded-full" 
        style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.15 }}></div>
      
      {/* Spotlight effect - now using CSS variables for theme compatibility */}
      <div 
        className="spotlight absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), var(--color-primary) 0%, rgba(0, 0, 0, 0) 60%)`,
          opacity: 0.1
        }}
      />
      
      {/* Main content */}
      <div className="container mx-auto px-4 z-10">
        <div ref={contentRef} className="hero-content relative">
          {/* Terminal UI animation - updated with better theme compatibility */}
          {showTerminal && (
            <div className="terminal mb-6 w-full md:max-w-md hero-anim-item backdrop-blur-sm">
              <div className="terminal-header bg-gray-800/90 rounded-t-md p-2 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div className="text-xs text-gray-400 ml-2 flex items-center">
                  <Terminal className="w-3 h-3 mr-1" /> ~/archie-portfolio
                </div>
              </div>
              <div className="terminal-body bg-gray-900/90 rounded-b-md p-3 font-mono text-sm">
                <div className="flex">
                  <span style={{ color: 'var(--syntax-function)' }}>archie@dev</span>
                  <span style={{ color: 'var(--syntax-operator)' }}>:</span>
                  <span style={{ color: 'var(--syntax-variable)' }}>~</span>
                  <span style={{ color: 'var(--syntax-operator)' }}>$ </span>
                  <span style={{ color: 'var(--color-text)' }}>Running Portfolio.start()</span>
                </div>
                <div className="mt-1" style={{ color: 'var(--syntax-string)' }}>Portfolio initialized successfully!</div>
                <div className="mt-1">
                  <span style={{ color: 'var(--syntax-keyword)' }}>import</span>
                  <span style={{ color: 'var(--color-text)' }}> &#123; Developer &#125; </span>
                  <span style={{ color: 'var(--syntax-keyword)' }}>from</span>
                  <span style={{ color: 'var(--syntax-string)' }}> 'archie-antone'</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Main heading with animated glitch effect */}
          <h2 className="text-2xl md:text-3xl font-medium mb-2 hero-anim-item flex items-center">
            <Code className="mr-2" style={{ color: 'var(--color-primary)' }} /> Hello, I'm
          </h2>
          <h1 className="glitch-text text-5xl md:text-7xl font-bold font-poppins mb-4 hero-anim-item relative">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Archie Antone
            </span>
            <span className="absolute top-0 left-0 w-full opacity-50 -z-1"
              style={{ 
                color: 'var(--color-primary)', 
                clipPath: 'rect(85% 0 70% 0)', 
                transform: 'translateX(-5px)' 
              }}>
              Archie Antone
            </span>
            <span className="absolute top-0 left-0 w-full opacity-50 -z-1"
              style={{ 
                color: 'var(--color-secondary)', 
                clipPath: 'rect(15% 0 30% 0)', 
                transform: 'translateX(5px)' 
              }}>
              Archie Antone
            </span>
          </h1>
          
          {/* Typing effect - now uses CSS variables for colors */}
          <h3 className="text-2xl md:text-4xl font-medium mb-6 hero-anim-item">
            <TypingEffect 
              words={developerTypeWords} 
              className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" 
            />
          </h3>
          
          <p className="text-lg md:text-xl max-w-2xl mb-8 hero-anim-item">
            I build scalable and efficient web applications with a focus on creating innovative digital solutions.
          </p>
          
          {/* Action buttons with theme-compatible colors */}
          <div className="flex flex-wrap gap-4 hero-anim-item">
            <a
              href="#projects"
              className="px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => {
                e.preventDefault();
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: projectsSection, offsetY: 80 },
                    ease: "power3.inOut",
                  });
                }
              }}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg hover:-translate-y-1"
              style={{
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
              }}
              onClick={(e) => {
                e.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: contactSection, offsetY: 80 },
                    ease: "power3.inOut",
                  });
                }
              }}
            >
              Contact Me
            </a>
          </div>
          
          {/* Social links */}
          <div className="mt-6 flex space-x-4 hero-anim-item">
            <a 
              href={SOCIAL_LINKS.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: 'var(--color-primary)' }}
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a 
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: 'var(--color-primary)' }}
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Animated 3D Cube */}
      <div className="absolute right-10 top-1/3 hidden lg:block">
        <CubeScene size={180} />
      </div>
      
      {/* Developer-style decorative elements */}
      <div className="absolute top-20 right-10 font-mono text-xs hidden lg:block opacity-30">
        &lt;!-- Code is poetry --&gt;
      </div>
      
      <div className="absolute bottom-20 left-10 font-mono text-xs hidden lg:block opacity-30">
        &lt;dev&gt;Passionate about building&lt;/dev&gt;
      </div>
      
      {/* Scroll down indicator */}
      <div 
        ref={chevronRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={handleChevronClick}
      >
        <a href="#about" style={{ color: 'var(--color-primary)' }} onClick={(e) => e.preventDefault()}>
          <ChevronDown className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
