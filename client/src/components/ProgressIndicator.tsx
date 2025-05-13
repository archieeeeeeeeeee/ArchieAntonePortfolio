import { useEffect, useRef } from "react";

const ProgressIndicator = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgressBar = () => {
      if (!progressRef.current) return;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      progressRef.current.style.width = `${scrollPercent}%`;
    };

    // Initial update
    updateProgressBar();
    
    // Add event listener
    window.addEventListener("scroll", updateProgressBar);
    
    // Clean up event listener
    return () => window.removeEventListener("scroll", updateProgressBar);
  }, []);

  return (
    <div
      ref={progressRef}
      className="progress-indicator h-1 fixed top-0 left-0 bg-primary z-[9999]"
    />
  );
};

export default ProgressIndicator;
