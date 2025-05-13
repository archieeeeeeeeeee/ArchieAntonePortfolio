import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import ParticlesCanvas from "@/components/ParticlesCanvas";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Hero content animation
    tl.from(contentRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
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

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticlesCanvas />
      <div className="blob bg-primary/30 w-64 h-64 top-20 -left-20"></div>
      <div className="blob bg-secondary/30 w-80 h-80 bottom-10 right-10"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div ref={contentRef} className="hero-content">
          <h2 className="text-2xl md:text-3xl font-medium mb-2">Hello, I'm</h2>
          <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-4">Archie Antone</h1>
          <h3 className="text-2xl md:text-4xl font-medium mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Full-Stack Web Developer
          </h3>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            I build scalable and efficient web applications with a focus on creating innovative digital solutions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="bg-primary hover:bg-primary/90 text-light px-6 py-3 rounded-md font-medium transition-colors"
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
              className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-medium transition-colors"
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
