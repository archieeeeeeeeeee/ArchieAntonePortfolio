import { useEffect, useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import gsap from "gsap";
import { resume } from "@/data/resume";

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    tl.from(headingRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
    });

    // Projects grid animation
    tl.from(projectsGridRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
    }, "-=0.4");

    // Staggered animation for project cards
    const cards = projectsGridRef.current?.querySelectorAll('.project-card');
    if (cards) {
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

    // Add hover animations for project cards
    cards?.forEach(card => {
      const overlay = card.querySelector('.project-overlay');
      const image = card.querySelector('.project-image');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
        gsap.to(image, { scale: 1.05, duration: 0.5 });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(overlay, { opacity: 0, duration: 0.3 });
        gsap.to(image, { scale: 1, duration: 0.5 });
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 relative"
    >
      <div className="blob bg-secondary/20 w-80 h-80 right-0 top-1/4"></div>
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="section-heading mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3">My Projects</h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>
        
        <div 
          ref={projectsGridRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 projects-grid"
        >
          {resume.projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card overflow-hidden rounded-lg bg-dark/50 shadow-lg border border-gray-800"
            >
              <div className="relative overflow-hidden h-56">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-image w-full h-full object-cover transition-transform duration-500" 
                />
                <div className="project-overlay absolute inset-0 bg-primary/80 opacity-0 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <a 
                      href={project.liveUrl} 
                      className="bg-dark text-light rounded-full w-12 h-12 inline-flex items-center justify-center mx-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <a 
                      href={project.githubUrl} 
                      className="bg-dark text-light rounded-full w-12 h-12 inline-flex items-center justify-center mx-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-light/70 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
