import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Code, Braces, FolderGit2 } from "lucide-react";
import gsap from "gsap";
import { resume } from "@/data/resume";
import ScrollingCode from "@/components/ScrollingCode";

interface ProjectCardProps {
  project: typeof resume.projects[0];
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    // Set up 3D tilt effect on hover
    const card = cardRef.current;
    const cardContent = card.querySelector('.card-content');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!card || !cardContent) return;
      
      // Calculate mouse position
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation values based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 5; // Max rotation 5deg
      const rotateX = ((centerY - y) / centerY) * 5; // Max rotation 5deg
      
      // Apply rotation
      gsap.to(cardContent, {
        rotateY,
        rotateX,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Shine effect (highlight) based on mouse position
      const shine = card.querySelector('.card-shine');
      if (shine) {
        gsap.to(shine, {
          opacity: 0.15,
          x: `${(x / rect.width) * 100}%`,
          y: `${(y / rect.height) * 100}%`,
          duration: 0.5
        });
      }
    };
    
    const handleMouseLeave = () => {
      if (!cardContent) return;
      
      // Reset card rotation
      gsap.to(cardContent, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Reset shine effect
      const shine = card.querySelector('.card-shine');
      if (shine) {
        gsap.to(shine, { opacity: 0, duration: 0.5 });
      }
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <div 
      ref={cardRef}
      className="project-card relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card content with 3D transform */}
      <div className="card-content bg-dark/80 border border-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300">
        {/* Project image */}
        <div className="relative overflow-hidden h-48">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500" 
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          
          {/* Code overlay with animated typing effect */}
          <div 
            className="absolute inset-0 bg-dark/90 flex items-center justify-center transition-opacity duration-300"
            style={{ 
              opacity: isHovered ? 0.9 : 0, 
              visibility: isHovered ? 'visible' : 'hidden',
            }}
          >
            <div className="text-xs md:text-sm font-mono text-light/90 p-4 overflow-hidden">
              <div className="code-line">
                <span className="text-purple-400">function</span> 
                <span className="text-yellow-300"> {project.title.replace(/\s+/g, '')}</span>
                <span className="text-white">() {`{`}</span>
              </div>
              <div className="code-line ml-4">
                <span className="text-blue-400">const</span> 
                <span className="text-green-400"> tech</span> 
                <span className="text-white"> = [</span>
                {project.technologies.map((tech, i) => (
                  <span key={i}>
                    <span className="text-orange-400">'{tech}'</span>
                    {i < project.technologies.length - 1 && <span className="text-white">, </span>}
                  </span>
                ))}
                <span className="text-white">];</span>
              </div>
              <div className="code-line ml-4">
                <span className="text-blue-400">const</span> 
                <span className="text-green-400"> result</span> 
                <span className="text-white"> = </span>
                <span className="text-orange-400">'{project.description.substring(0, 50)}...'</span>
                <span className="text-white">;</span>
              </div>
              <div className="code-line ml-4">
                <span className="text-purple-400">return</span> 
                <span className="text-white"> (</span>
                <span className="text-green-400"> result</span>
                <span className="text-white"> );</span>
              </div>
              <div className="code-line">
                <span className="text-white">{`}`}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project details */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {project.title}
          </h3>
          <p className="text-light/70 mb-4">{project.description}</p>
          
          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, techIndex) => (
              <span 
                key={techIndex} 
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
          
          {/* Project links */}
          <div className="flex mt-4 space-x-3">
            <a 
              href={project.liveUrl} 
              className="bg-primary hover:bg-primary/90 text-light rounded-md px-3 py-2 text-sm flex items-center transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Live Site
            </a>
            <a 
              href={project.githubUrl} 
              className="bg-gray-800 hover:bg-gray-700 text-light rounded-md px-3 py-2 text-sm flex items-center transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-1" /> Code
            </a>
          </div>
        </div>
        
        {/* Glowing shine effect */}
        <div className="card-shine absolute w-40 h-40 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-xl opacity-0 pointer-events-none" />
      </div>
      
      {/* Bottom terminal line */}
      <div 
        className={`mt-2 text-xs font-mono text-light/50 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="text-green-400">$</span> git checkout {project.title.toLowerCase().replace(/\s+/g, '-')}
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Create timeline for animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "center center",
        toggleActions: "play none none none",
      },
    });

    // Heading animation
    if (headingRef.current) {
      tl.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      });
    }

    // Terminal animation
    if (terminalRef.current) {
      tl.from(terminalRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, "-=0.4");
      
      // Animate terminal lines
      const terminalLines = terminalRef.current.querySelectorAll('.terminal-line');
      if (terminalLines.length > 0) {
        gsap.from(terminalLines, {
          opacity: 0,
          y: 10,
          stagger: 0.2,
          duration: 0.5,
          scrollTrigger: {
            trigger: terminalRef.current,
            start: "top 80%",
          }
        });
      }
    }

    // Projects grid animation
    if (projectsGridRef.current) {
      tl.from(projectsGridRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, "-=0.4");
    }

    // Staggered animation for project cards
    const cards = projectsGridRef.current?.querySelectorAll('.project-card');
    if (cards && cards.length > 0) {
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: projectsGridRef.current,
          start: "top 70%",
        },
      });
    }

    // Blob animation
    const blob = sectionRef.current?.querySelector('.blob');
    if (blob) {
      gsap.to(blob, {
        x: 20,
        y: -20,
        rotation: 10,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="blob bg-secondary/20 w-80 h-80 right-0 top-1/4"></div>
      <div className="blob bg-primary/20 w-60 h-60 left-10 bottom-20"></div>
      
      {/* Scrolling code in the background */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 opacity-5 z-0 pointer-events-none">
        <ScrollingCode direction="right" speed={30} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="section-heading mb-6">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3 flex items-center">
            <FolderGit2 className="mr-3 text-primary" /> 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>
        
        {/* Terminal window */}
        <div ref={terminalRef} className="terminal-window bg-gray-900 rounded-lg border border-gray-700 p-4 mb-12 overflow-hidden">
          <div className="flex mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <div className="text-xs text-gray-400">projects ~ bash</div>
          </div>
          
          <div className="font-mono text-sm">
            <div className="terminal-line">
              <span className="text-green-400">dev@archieantone</span>
              <span className="text-gray-400">:</span>
              <span className="text-blue-400">~/projects</span>
              <span className="text-gray-400">$</span>
              <span className="text-light"> git status</span>
            </div>
            <div className="terminal-line text-green-400 ml-2">
              On branch main. Your repository is up to date.
            </div>
            <div className="terminal-line">
              <span className="text-green-400">dev@archieantone</span>
              <span className="text-gray-400">:</span>
              <span className="text-blue-400">~/projects</span>
              <span className="text-gray-400">$</span>
              <span className="text-light"> ls -la</span>
            </div>
            <div className="terminal-line text-gray-300 ml-2">
              drwxr-xr-x  truck-management-system/<br />
              drwxr-xr-x  tool-issuance-app/<br />
              drwxr-xr-x  truck-inspection-system/<br />
              drwxr-xr-x  jobsconnect/<br />
              drwxr-xr-x  wags-ph/
            </div>
            <div className="terminal-line">
              <span className="text-green-400">dev@archieantone</span>
              <span className="text-gray-400">:</span>
              <span className="text-blue-400">~/projects</span>
              <span className="text-gray-400">$</span>
              <span className="text-light"> git log --oneline</span>
            </div>
            <div className="terminal-line text-gray-300 ml-2">
              8f42eb7 Added responsive design to Wags-PH<br />
              a71e593 Fixed login functionality in JobsConnect<br />
              d34f22c Implemented truck tracking feature
            </div>
          </div>
        </div>
        
        {/* Projects grid */}
        <div 
          ref={projectsGridRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 projects-grid"
        >
          {resume.projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
