import { useEffect, useRef } from "react";
import gsap from "gsap";
import { resume } from "@/data/resume";

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

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

    // Experience timeline animation
    tl.from(experienceRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.8,
    }, "-=0.4");

    // Education timeline animation
    tl.from(educationRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.8,
    }, "-=0.4");

    // Staggered animation for timeline items
    const experienceItems = experienceRef.current?.querySelectorAll('.timeline-item');
    if (experienceItems) {
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
    if (educationItems) {
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 bg-dark/50 relative"
    >
      <div className="blob bg-accent/20 w-72 h-72 -left-10 bottom-1/4"></div>
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="section-heading mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3">Experience & Education</h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div ref={experienceRef} className="experience-timeline">
            <h3 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Work Experience
            </h3>
            
            {resume.experience.map((exp, index) => (
              <div key={index} className={`timeline relative pl-8 ${index < resume.experience.length - 1 ? 'pb-8' : ''} timeline-item`}>
                <div className="timeline-dot"></div>
                <div className="bg-dark/80 p-5 rounded-lg border border-gray-800">
                  <h4 className="text-xl font-medium mb-1">{exp.title}</h4>
                  <p className="text-primary mb-2">{exp.company} | {exp.period}</p>
                  <p className="text-light/70">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div ref={educationRef} className="education-timeline">
            <h3 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Education & Certifications
            </h3>
            
            {resume.education.map((edu, index) => (
              <div key={index} className={`timeline relative pl-8 ${index < resume.education.length - 1 ? 'pb-8' : ''} timeline-item`}>
                <div className="timeline-dot"></div>
                <div className="bg-dark/80 p-5 rounded-lg border border-gray-800">
                  <h4 className="text-xl font-medium mb-1">{edu.degree}</h4>
                  <p className="text-primary mb-2">{edu.institution} | {edu.period}</p>
                  <p className="text-light/70">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="timeline relative pl-8 timeline-item">
              <div className="timeline-dot"></div>
              <div className="bg-dark/80 p-5 rounded-lg border border-gray-800">
                <h4 className="text-xl font-medium mb-1">Certifications</h4>
                <p className="text-primary mb-2">Professional Development</p>
                <ul className="text-light/70 list-disc list-inside">
                  {resume.certifications.map((cert, index) => (
                    <li key={index}>{cert.name} ({cert.year})</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
