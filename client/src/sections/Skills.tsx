import { useEffect, useRef } from "react";
import { 
  Monitor, Server, Database, Paintbrush, Cloud, Cog
} from "lucide-react";
import gsap from "gsap";
import { resume } from "@/data/resume";

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const skillBarsRef = useRef<HTMLDivElement[]>([]);

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

    // Content animation
    tl.from(contentRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      onComplete: animateSkillBars,
    }, "-=0.4");

    // Cards animation
    tl.from(cardsRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
    }, "-=0.4");

    // Blob animation
    const blob = sectionRef.current?.querySelector('.blob');
    if (blob) {
      gsap.to(blob, {
        x: -20,
        y: 20,
        rotation: -10,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Staggered animation for skill cards
    const cards = cardsRef.current?.querySelectorAll('.skill-card');
    if (cards) {
      gsap.from(cards, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 70%",
        },
      });
    }

    function animateSkillBars() {
      skillBarsRef.current.forEach(bar => {
        const width = bar.getAttribute('data-width') || "0%";
        gsap.to(bar, {
          width,
          duration: 1.5,
          ease: "power2.out",
        });
      });
    }
  }, []);

  // Add skill bars to ref collection
  const addToSkillBarsRef = (el: HTMLDivElement) => {
    if (el && !skillBarsRef.current.includes(el)) {
      skillBarsRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 bg-dark/50 relative"
    >
      <div className="blob bg-primary/20 w-96 h-96 -left-20 top-1/3"></div>
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="section-heading mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3">My Skills</h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div ref={contentRef} className="skills-content">
            <h3 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Technical Expertise
            </h3>
            
            {resume.skills.technical.map((skill, index) => (
              <div key={index} className="skill-container mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-primary">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    ref={addToSkillBarsRef}
                    className="skill-progress bg-primary h-2.5 rounded-full"
                    style={{ width: "0%" }}
                    data-width={`${skill.level}%`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div ref={cardsRef} className="skills-cards">
            <h3 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Other Skills
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 transition-transform">
                <div className="text-primary text-3xl mb-3">
                  <Monitor className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Front-end Development</h4>
                <p className="text-light/70">Creating responsive and user-friendly interfaces with modern frameworks.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 transition-transform">
                <div className="text-primary text-3xl mb-3">
                  <Server className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Back-end Development</h4>
                <p className="text-light/70">Building robust server-side applications and APIs.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 transition-transform">
                <div className="text-primary text-3xl mb-3">
                  <Database className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Database Management</h4>
                <p className="text-light/70">Designing efficient database schemas and optimizing queries.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 transition-transform">
                <div className="text-primary text-3xl mb-3">
                  <Paintbrush className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Design Software</h4>
                <p className="text-light/70">Proficient in Adobe Photoshop, Illustrator, and Lightroom.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 transition-transform">
                <div className="text-primary text-3xl mb-3">
                  <Cloud className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Cloud Computing</h4>
                <p className="text-light/70">Working with cloud platforms for scalable applications.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 transition-transform">
                <div className="text-primary text-3xl mb-3">
                  <Cog className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">API Integration</h4>
                <p className="text-light/70">Connecting applications with third-party services and APIs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
