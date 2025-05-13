import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { useGSAP } from "@/lib/useGSAP";

// Core components 
import CustomCursor from "@/components/CustomCursor";
import ProgressIndicator from "@/components/ProgressIndicator";
import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";
import NotFound from "@/pages/not-found";

// Load sections with React.lazy for better performance
const Hero = lazy(() => import("@/sections/Hero"));
const About = lazy(() => import("@/sections/About"));
const Skills = lazy(() => import("@/sections/Skills"));
const Projects = lazy(() => import("@/sections/Projects"));
const Experience = lazy(() => import("@/sections/Experience"));
const Contact = lazy(() => import("@/sections/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Loading indicator for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <div className="flex flex-col items-center">
      <div className="animate-pulse flex space-x-1">
        <div className="h-3 w-3 bg-primary rounded-full"></div>
        <div className="h-3 w-3 bg-primary rounded-full"></div>
        <div className="h-3 w-3 bg-primary rounded-full"></div>
      </div>
      <div className="mt-3 text-sm text-light/70 font-mono">
        Loading<span className="cursor-blink">_</span>
      </div>
    </div>
  </div>
);

// Page transitions
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!pageRef.current) return;
    
    // Initial page load animation
    const tl = gsap.timeline();
    
    tl.from(pageRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
    
    // Clean up function for page navigation
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <div ref={pageRef} className="page-transition">
      {children}
    </div>
  );
};

// Home page component
function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  
  // Initialize GSAP
  useGSAP();

  // Handle scroll events for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Page load effect
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Smooth scroll initialization
    if (mainRef.current) {
      ScrollTrigger.refresh();
    }
    
    // Clean up timer
    return () => clearTimeout(timer);
  }, []);
  
  // Code-like text animation for console
  useEffect(() => {
    if (isLoaded) {
      console.log("%c👋 Welcome to my portfolio!", "color: #3a86ff; font-weight: bold; font-size: 20px;");
      console.log("%cFeel free to check out my work and explore the site. Let's connect!", "color: #ff006e;");
      console.log("%c👨‍💻 Happy coding!", "color: #3a86ff;");
    }
  }, [isLoaded]);

  // Loading screen
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 bg-dark flex items-center justify-center flex-col">
        <div className="text-2xl font-bold font-mono mb-4 relative">
          <div className="flex items-center">
            <span className="text-primary">&lt;</span>
            <span className="text-white">Archie</span>
            <span className="text-primary">.</span>
            <span className="text-white">dev</span>
            <span className="text-primary">/&gt;</span>
          </div>
        </div>
        <div className="h-1 w-48 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary animate-load-progress"></div>
        </div>
        <div className="mt-3 text-xs font-mono text-light/70">
          Initializing code portfolio<span className="cursor-blink">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark text-light font-inter overflow-x-hidden relative">
      <CustomCursor />
      <ProgressIndicator />
      <Navbar />
      <main ref={mainRef}>
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
          <Footer />
        </Suspense>
      </main>
      <BackToTop visible={showBackToTop} />
      
      {/* Developer-style corner decoration */}
      <div className="fixed left-0 top-0 w-16 h-16 pointer-events-none opacity-30 z-10 hidden md:block">
        <div className="text-primary font-mono">{"<>"}</div>
      </div>
      <div className="fixed right-0 bottom-0 w-16 h-16 pointer-events-none opacity-30 z-10 hidden md:block">
        <div className="text-primary font-mono">{"</>"}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <PageTransition>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </TooltipProvider>
  );
}

export default App;
