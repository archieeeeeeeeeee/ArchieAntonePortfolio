import { useEffect, useRef } from "react";
import { FileDown } from "lucide-react";
import gsap from "gsap";
import { resume } from "@/data/resume";

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

    // Image animation
    tl.from(imageRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.8,
    }, "-=0.4");

    // Content animation
    tl.from(contentRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.8,
    }, "-=0.4");

    // Blob animation
    const blob = document.querySelector('.blob');
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
      id="about"
      className="py-24 relative"
    >
      <div className="blob bg-accent/20 w-72 h-72 top-20 right-0"></div>
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="section-heading mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3">About Me</h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div ref={imageRef} className="about-image">
            <img 
              src="https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
              alt="Archie Antone - Web Developer" 
              className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]" 
            />
          </div>
          <div ref={contentRef} className="about-content">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Passionate Web Developer
            </h3>
            <p className="text-lg mb-6">
              As a full-stack web developer based in Santa Maria, Bulacan, I create scalable and efficient web applications that deliver exceptional user experiences. My passion lies in building innovative digital solutions while continuously improving my technical skills.
            </p>
            <p className="text-lg mb-6">
              I specialize in both front-end and back-end development, creating responsive interfaces and robust server-side applications. With attention to detail and a problem-solving mindset, I deliver high-quality code that meets modern development standards.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="font-medium">Name:</p>
                <p>{resume.name}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{resume.email}</p>
              </div>
              <div>
                <p className="font-medium">Location:</p>
                <p>{resume.location}</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p>{resume.phone}</p>
              </div>
            </div>
            <a 
              href="#" 
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              <FileDown className="mr-2 h-5 w-5" /> Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
