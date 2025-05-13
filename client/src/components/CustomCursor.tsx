import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Initialize cursor position to center of viewport
    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    
    // Mouse move event
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power1.out",
      });
    };

    // Mouse down and up events for expanding/contracting cursor
    const onMouseDown = () => {
      gsap.to(cursor, {
        scale: 1.5,
        duration: 0.2,
      });
    };

    const onMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
      });
    };

    // Add event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="cursor-follow hidden md:block pointer-events-none fixed w-5 h-5 bg-primary/50 rounded-full z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
    />
  );
};

export default CustomCursor;
