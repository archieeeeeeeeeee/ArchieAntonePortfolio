import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const navTl = useRef<gsap.core.Timeline>();

  // Navigation links
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ];

  // Handle scroll behavior for the navbar
  useEffect(() => {
    navTl.current = gsap.timeline();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navTl.current?.to(navRef.current, {
          padding: "0.5rem 0",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        navTl.current?.to(navRef.current, {
          padding: "1rem 0",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle active navigation item on scroll
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-link");

    const handleNavHighlight = () => {
      let current = "";
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id") || "";
        }
      });
      
      navItems.forEach((link) => {
        link.classList.remove("active-nav");
        const href = link.getAttribute("href") || "";
        if (href === `#${current}`) {
          link.classList.add("active-nav");
        }
      });
    };

    window.addEventListener("scroll", handleNavHighlight);
    return () => window.removeEventListener("scroll", handleNavHighlight);
  }, []);

  // Smooth scroll to section when clicking on nav links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: targetElement, offsetY: 80 },
        ease: "power3.inOut",
      });
      
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav
      ref={navRef}
      id="main-nav"
      className="fixed top-0 left-0 w-full backdrop-blur-md z-50 transition-all duration-300 py-4"
      style={{
        backgroundColor: 'var(--color-background)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a
          href="#home"
          className="text-2xl font-bold font-poppins relative"
          onClick={(e) => handleNavClick(e, "#home")}
        >
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Archie
          </span>
          <span style={{ color: 'var(--color-text)' }}>.dev</span>
          <div 
            className="absolute -bottom-1 left-0 h-1 w-full rounded-full opacity-70"
            style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
          ></div>
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link font-medium transition-colors relative hover:scale-105 group"
              style={{ 
                color: 'var(--color-text)',
                textShadow: '0px 1px 1px rgba(0,0,0,0.1)'
              }}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
              <span 
                className="absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--color-primary)' }}
              ></span>
            </a>
          ))}
        </div>
        
        <button
          className="md:hidden p-2 rounded-md"
          style={{ 
            color: 'var(--color-text)', 
            backgroundColor: 'var(--color-primary)', 
            opacity: 0.8 
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden backdrop-blur-md ${
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
        style={{
          backgroundColor: 'var(--color-background)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors py-3 px-4 rounded-md hover:scale-105"
              style={{ 
                color: 'var(--color-text)',
                backgroundColor: link.href === "#home" ? 'rgba(58, 134, 255, 0.1)' : 'transparent'
              }}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
