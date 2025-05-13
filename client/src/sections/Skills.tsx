import { useEffect, useRef, useState } from "react";
import { 
  Monitor, Server, Database, Paintbrush, Cloud, Cog,
  Code, Globe, Lock, Terminal, Cpu
} from "lucide-react";
import { 
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, 
  FaPhp, FaDatabase, FaGithub, FaFigma 
} from 'react-icons/fa';
import { SiTailwindcss, SiMysql } from 'react-icons/si';
import gsap from "gsap";
import { resume } from "@/data/resume";
import ScrollingCode from "@/components/ScrollingCode";

interface SkillIconProps {
  progress: number;
  size?: number;
  color?: string;
  icon: React.ReactNode;
  name: string;
}

const SkillIcon = ({ progress, size = 60, color = "#3a86ff", icon, name }: SkillIconProps) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const [hover, setHover] = useState(false);
  
  useEffect(() => {
    if (circleRef.current) {
      // Calculate the circle's circumference
      const radius = size / 2;
      const circumference = 2 * Math.PI * radius;
      
      // Set the circle's stroke-dasharray
      circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
      
      // Set the initial offset to make the circle empty
      circleRef.current.style.strokeDashoffset = `${circumference}`;
      
      // Animate the progress
      gsap.to(circleRef.current, {
        strokeDashoffset: circumference - (progress / 100) * circumference,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: iconRef.current,
          start: "top 80%",
        }
      });
    }
  }, [progress, size]);
  
  return (
    <div 
      ref={iconRef} 
      className="skill-icon flex flex-col items-center justify-center m-2 relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Progress circle */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="absolute top-0 left-0">
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={(size / 2) - 4} 
            fill="transparent" 
            stroke="#2a2a2a" 
            strokeWidth="3"
          />
        </svg>
        
        {/* Progress circle */}
        <svg width={size} height={size} className="absolute top-0 left-0 -rotate-90">
          <circle 
            ref={circleRef}
            cx={size / 2} 
            cy={size / 2} 
            r={(size / 2) - 4} 
            fill="transparent" 
            stroke={color} 
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Icon */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-light transition-transform duration-300"
          style={{ transform: hover ? 'scale(1.2)' : 'scale(1)' }}
        >
          {icon}
        </div>
      </div>
      
      {/* Skill name */}
      <div className="mt-2 text-sm font-medium">{name}</div>
      
      {/* Percentage */}
      <div 
        className="percentage absolute top-0 right-0 bg-primary text-xs text-light px-1 py-0.5 rounded opacity-0 transition-opacity"
        style={{ opacity: hover ? 1 : 0 }}
      >
        {progress}%
      </div>
    </div>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const skillBarsRef = useRef<HTMLDivElement[]>([]);
  const codeBlockRef = useRef<HTMLDivElement>(null);

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

    // Elements to animate
    const elementsToAnimate = [
      headingRef.current,
      contentRef.current,
      cardsRef.current,
      codeBlockRef.current
    ].filter(Boolean);

    // Heading animation
    if (headingRef.current) {
      tl.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      });
    }

    // Content animation
    if (contentRef.current) {
      tl.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        onComplete: animateSkillBars,
      }, "-=0.4");
    }

    // Cards animation
    if (cardsRef.current) {
      tl.from(cardsRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, "-=0.4");
    }

    // Code block animation
    if (codeBlockRef.current) {
      tl.from(codeBlockRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, "-=0.4");
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

    // Terminal typing effect
    const terminalLines = document.querySelectorAll('.terminal-line');
    if (terminalLines.length > 0) {
      gsap.from(terminalLines, {
        opacity: 0,
        y: 10,
        stagger: 0.2,
        duration: 0.5,
        scrollTrigger: {
          trigger: terminalLines[0],
          start: "top 80%",
        }
      });
    }

    function animateSkillBars() {
      skillBarsRef.current.forEach(bar => {
        const width = bar.getAttribute('data-width') || "0%";
        if (bar) {
          gsap.to(bar, {
            width,
            duration: 1.5,
            ease: "power2.out",
          });
        }
      });
    }
  }, []);

  // Add skill bars to ref collection
  const addToSkillBarsRef = (el: HTMLDivElement) => {
    if (el && !skillBarsRef.current.includes(el)) {
      skillBarsRef.current.push(el);
    }
  };

  // Skill icons data with icons
  const skillIcons = [
    { icon: <FaHtml5 size={30} className="text-[#E34F26]" />, name: "HTML5", progress: 90 },
    { icon: <FaCss3Alt size={30} className="text-[#1572B6]" />, name: "CSS3", progress: 85 },
    { icon: <FaJs size={30} className="text-[#F7DF1E]" />, name: "JavaScript", progress: 85 },
    { icon: <FaReact size={30} className="text-[#61DAFB]" />, name: "React", progress: 75 },
    { icon: <FaNodeJs size={30} className="text-[#339933]" />, name: "Node.js", progress: 70 },
    { icon: <FaPhp size={30} className="text-[#777BB4]" />, name: "PHP", progress: 80 },
    { icon: <SiMysql size={30} className="text-[#4479A1]" />, name: "MySQL", progress: 85 },
    { icon: <SiTailwindcss size={30} className="text-[#06B6D4]" />, name: "Tailwind", progress: 80 },
    { icon: <FaGithub size={30} className="text-white" />, name: "Git", progress: 75 },
    { icon: <FaFigma size={30} className="text-[#F24E1E]" />, name: "Figma", progress: 65 },
  ];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 bg-dark/50 relative overflow-hidden"
    >
      <div className="blob bg-primary/20 w-96 h-96 -left-20 top-1/3"></div>
      
      {/* Scrolling code in the background */}
      <div className="absolute -bottom-16 left-0 w-full opacity-10 z-0 pointer-events-none">
        <ScrollingCode direction="left" speed={40} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="section-heading mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3 flex items-center">
            <Code className="mr-3 text-primary" /> 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Skills
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>
        
        {/* Code block for skills */}
        <div ref={codeBlockRef} className="code-block bg-gray-900 rounded-lg border border-gray-700 p-4 mb-12 overflow-hidden font-mono text-sm">
          <div className="flex mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <div className="text-xs text-gray-400">skills.js</div>
          </div>
          <div className="terminal-line">
            <span className="text-purple-400">const</span> 
            <span className="text-blue-400"> developer</span> 
            <span className="text-white"> = {`{`}</span>
          </div>
          <div className="terminal-line ml-4">
            <span className="text-blue-400">name</span>
            <span className="text-white">: </span>
            <span className="text-green-400">'Archie Antone'</span>
            <span className="text-white">,</span>
          </div>
          <div className="terminal-line ml-4">
            <span className="text-blue-400">title</span>
            <span className="text-white">: </span>
            <span className="text-green-400">'Full-Stack Developer'</span>
            <span className="text-white">,</span>
          </div>
          <div className="terminal-line ml-4">
            <span className="text-blue-400">skills</span>
            <span className="text-white">: [</span>
            <span className="text-green-400">'HTML'</span>
            <span className="text-white">, </span>
            <span className="text-green-400">'CSS'</span>
            <span className="text-white">, </span>
            <span className="text-green-400">'JavaScript'</span>
            <span className="text-white">, </span>
            <span className="text-green-400">'PHP'</span>
            <span className="text-white">, </span>
            <span className="text-green-400">'MySQL'</span>
            <span className="text-white">],</span>
          </div>
          <div className="terminal-line ml-4">
            <span className="text-blue-400">experience</span>
            <span className="text-white">: </span>
            <span className="text-orange-400">function</span>
            <span className="text-white">() {`{`}</span>
          </div>
          <div className="terminal-line ml-8">
            <span className="text-purple-400">return</span>
            <span className="text-white"> </span>
            <span className="text-green-400">'Building scalable and efficient web applications'</span>
            <span className="text-white">;</span>
          </div>
          <div className="terminal-line ml-4">
            <span className="text-white">{`}`},</span>
          </div>
          <div className="terminal-line">
            <span className="text-white">{`}`};</span>
          </div>
        </div>
        
        {/* Skill icons grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <Terminal className="mr-2 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Technical Stack
            </span>
          </h3>
          <div className="flex flex-wrap justify-center">
            {skillIcons.map((skill, index) => (
              <SkillIcon
                key={index}
                icon={skill.icon}
                name={skill.name}
                progress={skill.progress}
                color={index % 2 === 0 ? "#3a86ff" : "#ff006e"}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div ref={contentRef} className="skills-content">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <Cpu className="mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Technical Expertise
              </span>
            </h3>
            
            {resume.skills.technical.map((skill, index) => (
              <div key={index} className="skill-container mb-6 group">
                <div className="flex justify-between mb-2">
                  <span className="font-medium group-hover:text-primary transition-colors">{skill.name}</span>
                  <span className="text-primary">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 relative overflow-hidden">
                  {/* Glowing overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(58, 134, 255, 0.8), transparent)',
                      animation: 'shine 1.5s infinite',
                      backgroundSize: '200% 100%',
                    }}
                  ></div>
                  <div
                    ref={addToSkillBarsRef}
                    className="skill-progress bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full"
                    style={{ width: "0%" }}
                    data-width={`${skill.level}%`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div ref={cardsRef} className="skills-cards">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <Globe className="mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Other Skills
              </span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div className="text-primary text-3xl mb-3">
                  <Monitor className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Front-end Development</h4>
                <p className="text-light/70">Creating responsive and user-friendly interfaces with modern frameworks.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div className="text-primary text-3xl mb-3">
                  <Server className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Back-end Development</h4>
                <p className="text-light/70">Building robust server-side applications and APIs.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div className="text-primary text-3xl mb-3">
                  <Database className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Database Management</h4>
                <p className="text-light/70">Designing efficient database schemas and optimizing queries.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div className="text-primary text-3xl mb-3">
                  <Paintbrush className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Design Software</h4>
                <p className="text-light/70">Proficient in Adobe Photoshop, Illustrator, and Lightroom.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div className="text-primary text-3xl mb-3">
                  <Cloud className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">Cloud Computing</h4>
                <p className="text-light/70">Working with cloud platforms for scalable applications.</p>
              </div>
              
              <div className="skill-card bg-dark/80 rounded-lg p-5 border border-gray-800 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div className="text-primary text-3xl mb-3">
                  <Lock className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium mb-2">System Security</h4>
                <p className="text-light/70">Implementing secure coding practices and application protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animation is handled with CSS */}
    </section>
  );
};

export default Skills;
