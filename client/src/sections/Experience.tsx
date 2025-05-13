import { useEffect, useRef, useState } from "react";
import { BriefcaseIcon, GraduationCap, Award, GitBranch, GitCommit } from "lucide-react";
import gsap from "gsap";
import { resume } from "@/data/resume";
import ScrollingCode from "@/components/ScrollingCode";

// Binary 0s and 1s animation component
const BinaryBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [binaries, setBinaries] = useState<{id: number, x: number, y: number, value: string}[]>([]);
  
  useEffect(() => {
    // Create binary bits initially
    const createBinaryBits = () => {
      const newBinaries = [];
      const count = 30; // Number of binary bits to create
      
      for (let i = 0; i < count; i++) {
        newBinaries.push({
          id: i,
          x: Math.random() * 100, // Random x position
          y: Math.random() * 100, // Random y position
          value: Math.random() > 0.5 ? '1' : '0' // Random 0 or 1
        });
      }
      
      setBinaries(newBinaries);
    };
    
    createBinaryBits();
    
    // Change some values periodically
    const interval = setInterval(() => {
      setBinaries(prev => 
        prev.map(binary => 
          Math.random() > 0.9 
            ? { ...binary, value: binary.value === '0' ? '1' : '0' } 
            : binary
        )
      );
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {binaries.map(binary => (
        <div 
          key={binary.id}
          className="absolute text-primary/20 font-mono"
          style={{ 
            left: `${binary.x}%`, 
            top: `${binary.y}%`,
            fontSize: `${Math.random() * 14 + 10}px` // Random font size
          }}
        >
          {binary.value}
        </div>
      ))}
    </div>
  );
};

// Timeline item component with enhanced animation
interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
  isLast?: boolean;
  icon?: React.ReactNode;
}

const TimelineItem = ({ title, subtitle, period, description, isLast = false, icon }: TimelineItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (!itemRef.current) return;
    
    // Scale up effect on hover
    if (isHovered) {
      gsap.to(itemRef.current, {
        scale: 1.02,
        boxShadow: '0 10px 25px -5px rgba(58, 134, 255, 0.2)',
        border: '1px solid rgba(58, 134, 255, 0.4)',
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(itemRef.current, {
        scale: 1,
        boxShadow: 'none',
        border: '1px solid rgba(75, 85, 99, 0.2)',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isHovered]);
  
  return (
    <div className={`timeline relative pl-8 ${!isLast ? 'pb-8' : ''} timeline-item`}>
      {/* Vertical line with git branch effect */}
      <div className="timeline-dot flex items-center justify-center bg-primary text-dark z-10">
        {icon || <GitCommit className="w-2 h-2" />}
      </div>
      
      {/* Decorative git branch */}
      {!isLast && (
        <div className="branch absolute left-[9px] top-[24px] w-2 h-2 rounded-full bg-primary/30"></div>
      )}
      
      {/* Timeline card */}
      <div 
        ref={itemRef}
        className="bg-dark/80 p-5 rounded-lg border border-gray-800/20 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Code-like commit hash */}
        <div className="text-xs font-mono text-gray-500 mb-2">
          commit {Array.from({ length: 8 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join('')}...
        </div>
        
        <h4 className="text-xl font-medium mb-1 flex items-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </span>
        </h4>
        
        <p className="text-primary mb-2 flex items-center">
          {subtitle} | {period}
        </p>
        
        <p className="text-light/70">
          {description}
        </p>
        
        {/* Terminal-like activity line */}
        {isHovered && (
          <div className="mt-3 pt-3 border-t border-gray-700 text-xs font-mono text-gray-400">
            $ git log --author="{title.toLowerCase().replace(/\s+/g, '-')}" --oneline
          </div>
        )}
      </div>
    </div>
  );
};

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

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

    // Experience timeline animation
    if (experienceRef.current) {
      tl.from(experienceRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.8,
      }, "-=0.4");
    }

    // Education timeline animation
    if (educationRef.current) {
      tl.from(educationRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.8,
      }, "-=0.4");
    }

    // Staggered animation for timeline items
    const experienceItems = experienceRef.current?.querySelectorAll('.timeline-item');
    if (experienceItems && experienceItems.length > 0) {
      gsap.from(experienceItems, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.2,
        scrollTrigger: {
          trigger: experienceRef.current,
          start: "top 70%",
        },
      });
    }

    const educationItems = educationRef.current?.querySelectorAll('.timeline-item');
    if (educationItems && educationItems.length > 0) {
      gsap.from(educationItems, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.2,
        scrollTrigger: {
          trigger: educationRef.current,
          start: "top 70%",
        },
      });
    }

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
    
    // Animate the branch dots
    const branches = document.querySelectorAll('.branch');
    if (branches.length > 0) {
      gsap.from(branches, {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.3,
        delay: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 bg-dark/50 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="blob bg-accent/20 w-72 h-72 -left-10 bottom-1/4"></div>
      <BinaryBackground />
      
      {/* Scrolling code in the background */}
      <div className="absolute top-1/4 left-0 w-full opacity-5 z-0 pointer-events-none">
        <ScrollingCode direction="right" speed={20} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="section-heading mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3 flex items-center">
            <GitBranch className="mr-3 text-primary" /> 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Experience & Education
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary"></div>
          
          {/* Git-like summary */}
          <div className="mt-4 p-3 bg-gray-900/50 rounded-md font-mono text-sm border border-gray-800">
            <div className="text-primary">$ git log --graph --oneline</div>
            <div className="mt-1 text-light/80">
              * <span className="text-yellow-400">a32fec7</span> Added new feature to truck management system<br />
              * <span className="text-yellow-400">b78d1e2</span> Received certification in SAP Business One<br />
              * <span className="text-yellow-400">c45f9a0</span> Developed JobsConnect platform<br />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div ref={experienceRef} className="experience-timeline">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <BriefcaseIcon className="mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Work Experience
              </span>
            </h3>
            
            {resume.experience.map((exp, index) => (
              <TimelineItem 
                key={index} 
                title={exp.title}
                subtitle={exp.company}
                period={exp.period}
                description={exp.description}
                isLast={index === resume.experience.length - 1}
                icon={<GitCommit className="w-2 h-2" />}
              />
            ))}
          </div>
          
          <div ref={educationRef} className="education-timeline">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <GraduationCap className="mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Education & Certifications
              </span>
            </h3>
            
            {resume.education.map((edu, index) => (
              <TimelineItem 
                key={index} 
                title={edu.degree}
                subtitle={edu.institution}
                period={edu.period}
                description={edu.description}
                isLast={index === resume.education.length - 1}
                icon={<GraduationCap className="w-2 h-2" />}
              />
            ))}
            
            <div className="mt-12">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2 text-primary h-5 w-5" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Certifications
                </span>
              </h4>
              
              <div className="bg-dark/80 p-5 rounded-lg border border-gray-800 font-mono">
                <div className="text-xs text-gray-400 mb-3">$ cat certifications.json</div>
                <div className="code-block text-sm">
                  <div className="text-light">{"["}</div>
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="ml-4">
                      <span className="text-light">{"{"}</span>
                      <br />
                      <span className="ml-4">
                        <span className="text-green-400">"name"</span>: 
                        <span className="text-yellow-300"> "{cert.name}"</span>,
                      </span>
                      <br />
                      <span className="ml-4">
                        <span className="text-green-400">"year"</span>: 
                        <span className="text-purple-400"> {cert.year}</span>
                      </span>
                      <br />
                      <span className="text-light">{"}"}
                      {index < resume.certifications.length - 1 ? "," : ""}
                      </span>
                    </div>
                  ))}
                  <div className="text-light">{"]"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
