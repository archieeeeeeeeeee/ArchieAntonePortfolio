import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize GSAP default settings
gsap.defaults({ ease: "power3.out" });

export const useGSAP = () => {
  useEffect(() => {
    // Add CSS rules for animations
    const style = document.createElement("style");
    style.innerHTML = `
      .cursor-follow {
        pointer-events: none;
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(58, 134, 255, 0.5);
        transform: translate(-50%, -50%);
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
      }
      .progress-indicator {
        height: 5px;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #3a86ff;
        z-index: 9999;
      }
      .project-card:hover .project-overlay {
        opacity: 1;
      }
      .project-card:hover .project-image {
        transform: scale(1.05);
      }
      .skill-progress {
        width: 0;
        transition: width 1.5s ease;
      }
      .timeline-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 2px;
        background-color: #3a86ff;
      }
      .timeline-dot {
        position: absolute;
        left: -8px;
        top: 24px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #3a86ff;
        border: 3px solid #121212;
      }
      .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        z-index: 0;
        opacity: 0.4;
      }
      .nav-link {
        position: relative;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #3a86ff;
        transition: width 0.3s ease;
      }
      .nav-link:hover::after {
        width: 100%;
      }
      .active-nav::after {
        width: 100%;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return { gsap };
};

export default useGSAP;
