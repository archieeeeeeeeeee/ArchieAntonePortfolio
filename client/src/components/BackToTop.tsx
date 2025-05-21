import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import gsap from "gsap";

interface BackToTopProps {
  visible: boolean;
}

const BackToTop = ({ visible }: BackToTopProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    if (visible) {
      gsap.to(buttonRef.current, {
        opacity: 1,
        visibility: "visible",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(buttonRef.current, {
        opacity: 0,
        visibility: "hidden",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [visible]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    gsap.to(window, {
      duration: 1,
      scrollTo: 0,
      ease: "power3.inOut",
    });
  };

  return (
    <a
      ref={buttonRef}
      href="#home"
      id="back-to-top"
      className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 invisible transition-all z-[9999]"
      onClick={handleClick}
      aria-label="Back to Top"
    >
      <ArrowUp className="h-5 w-5" />
    </a>
  );
};

export default BackToTop;
