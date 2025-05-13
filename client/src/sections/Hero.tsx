import { useEffect, useRef, useState } from "react";
import { ChevronDown, Code, Terminal } from "lucide-react";
import gsap from "gsap";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import CodeMatrix from "@/components/CodeMatrix";
import TypingEffect from "@/components/TypingEffect";
import CubeScene from "@/components/CubeScene";
import FloatingIcons from "@/components/FloatingIcons";
import Terrain3D from "@/components/Terrain3D";

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
    tl.from(contentRef.current?.querySelectorAll('.hero-anim-item'), {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.5,
    });

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
      
      {/* Particles and floating tech icons */}
      <ParticlesCanvas />
      <FloatingIcons count={15} />
      
      {/* Blob accents */}
      <div className="blob bg-primary/30 w-64 h-64 top-20 -left-20"></div>
      <div className="blob bg-secondary/30 w-80 h-80 bottom-10 right-10"></div>
      
      {/* Spotlight effect */}
      <div 
        className="spotlight absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(58, 134, 255, 0.15) 0%, rgba(18, 18, 18, 0) 60%)`,
        }}
      />
      
      {/* Main content */}
      <div className="container mx-auto px-4 z-10">
        <div ref={contentRef} className="hero-content relative">
          {/* Terminal UI animation */}
          {showTerminal && (
            <div className="terminal mb-6 w-full md:max-w-md hero-anim-item">
              <div className="terminal-header bg-gray-800 rounded-t-md p-2 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div className="text-xs text-gray-400 ml-2 flex items-center">
                  <Terminal className="w-3 h-3 mr-1" /> ~/archie-portfolio
                </div>
              </div>
              <div className="terminal-body bg-gray-900 rounded-b-md p-3 font-mono text-sm">
                <div className="flex">
                  <span className="text-green-400">archie@dev</span>
                  <span className="text-gray-400">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-gray-400">$ </span>
                  <span className="typing-text text-gray-200">Running Portfolio.start()</span>
                </div>
                <div className="mt-1 text-green-400">Portfolio initialized successfully!</div>
              </div>
            </div>
          )}
          
          {/* Main heading with animated glitch effect */}
          <h2 className="text-2xl md:text-3xl font-medium mb-2 hero-anim-item flex items-center">
            <Code className="mr-2 text-primary" /> Hello, I'm
          </h2>
          <h1 className="glitch-text text-5xl md:text-7xl font-bold font-poppins mb-4 hero-anim-item relative">
            Archie Antone
            <span className="absolute top-0 left-0 w-full text-primary opacity-50 -z-1"
              style={{ clipPath: 'rect(85% 0 70% 0)', transform: 'translateX(-5px)' }}>
              Archie Antone
            </span>
            <span className="absolute top-0 left-0 w-full text-secondary opacity-50 -z-1"
              style={{ clipPath: 'rect(15% 0 30% 0)', transform: 'translateX(5px)' }}>
              Archie Antone
            </span>
          </h1>
          
          {/* Typing effect */}
          <h3 className="text-2xl md:text-4xl font-medium mb-6 hero-anim-item">
            <TypingEffect 
              words={developerTypeWords} 
              className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" 
            />
          </h3>
          
          <p className="text-lg md:text-xl max-w-2xl mb-8 hero-anim-item">
            I build scalable and efficient web applications with a focus on creating innovative digital solutions.
          </p>
          
          <div className="flex flex-wrap gap-4 hero-anim-item">
            <a
              href="#projects"
              className="bg-primary hover:bg-primary/90 text-light px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
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
              className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
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
        </div>
      </div>
      
      {/* Animated 3D Cube */}
      <div className="absolute right-10 top-1/3 hidden lg:block">
        <CubeScene size={150} />
      </div>
      
      {/* Scroll down indicator */}
      <div 
        ref={chevronRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={handleChevronClick}
      >
        <a href="#about" className="text-light/70" onClick={(e) => e.preventDefault()}>
          <ChevronDown className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
