import { useEffect, useRef } from "react";
import gsap from "gsap";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.from(footerRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-8 bg-dark/80 border-t border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="#home" className="text-2xl font-bold font-poppins">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Archie
              </span>
              <span className="text-light">.dev</span>
            </a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-light/70">© {new Date().getFullYear()} Archie Antone. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
