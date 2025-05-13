import { useEffect, useRef, useState } from "react";
import { 
  MapPin, Mail, Phone, Linkedin, Github, Twitter, Dribbble, 
  SendHorizontal, Sparkles, Terminal, RefreshCw, MessagesSquare
} from "lucide-react";
import gsap from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { resume } from "@/data/resume";
import { apiRequest } from "@/lib/queryClient";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Animated connection lines component
const ConnectionLines = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      
      // Redraw everything on resize
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Create points
    const points: {x: number, y: number, vx: number, vy: number}[] = [];
    
    // Create points spread across the canvas
    const createPoints = () => {
      const numPoints = 20; // Number of points to create
      
      for (let i = 0; i < numPoints; i++) {
        // Create points randomly but with more density on the left and right sides
        let x, y;
        if (Math.random() < 0.5) {
          // Points near the left side
          x = Math.random() * (canvas.width * 0.4);
        } else {
          // Points near the right side
          x = canvas.width - Math.random() * (canvas.width * 0.4);
        }
        
        y = Math.random() * canvas.height;
        
        // Random velocity components
        const vx = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25
        const vy = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25
        
        points.push({ x, y, vx, vy });
      }
    };
    
    createPoints();
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw points
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        
        // Update position
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off the edges
        if (point.x <= 0 || point.x >= canvas.width) point.vx = -point.vx;
        if (point.y <= 0 || point.y >= canvas.height) point.vy = -point.vy;
        
        // Draw the point (very small and subtle)
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(58, 134, 255, 0.3)';
        ctx.fill();
        
        // Connect points with lines if they're close enough
        for (let j = 0; j < points.length; j++) {
          if (i === j) continue;
          
          const point2 = points[j];
          const dx = point.x - point2.x;
          const dy = point.y - point2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            // Draw line with opacity based on distance
            const opacity = 1 - (distance / 150);
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point2.x, point2.y);
            
            // Line gradient from primary to secondary color
            const gradient = ctx.createLinearGradient(point.x, point.y, point2.x, point2.y);
            gradient.addColorStop(0, `rgba(58, 134, 255, ${opacity * 0.2})`);
            gradient.addColorStop(1, `rgba(255, 0, 110, ${opacity * 0.2})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

// Animated social button component
interface AnimatedSocialButtonProps {
  icon: React.ReactNode;
  href: string;
  color?: string;
  delay?: number;
}

const AnimatedSocialButton = ({ 
  icon, 
  href, 
  color = "#3a86ff",
  delay = 0
}: AnimatedSocialButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    // Initial appear animation
    gsap.from(buttonRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      delay: 0.2 + delay,
      ease: "back.out(1.7)"
    });
    
    // Set up hover animation
    if (isHovered) {
      gsap.to(buttonRef.current, {
        scale: 1.2,
        boxShadow: `0 0 12px ${color}`,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(buttonRef.current, {
        scale: 1,
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isHovered, color, delay]);
  
  return (
    <a 
      ref={buttonRef}
      href={href} 
      className="social-button relative rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300"
      style={{ backgroundColor: `${color}20` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative z-10 text-white">
        {icon}
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full transition-opacity duration-300"
        style={{ 
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
    </a>
  );
};

// Type effect component
const TypeEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const textRef = useRef(text);
  const indexRef = useRef(0);
  
  useEffect(() => {
    const typeText = () => {
      if (indexRef.current < textRef.current.length) {
        setDisplayText(prev => prev + textRef.current.charAt(indexRef.current));
        indexRef.current++;
        setTimeout(typeText, 50);
      }
    };
    
    typeText();
    
    return () => {
      indexRef.current = textRef.current.length; // Stop typing
    };
  }, []);
  
  return (
    <span>{displayText}<span className="cursor-blink">|</span></span>
  );
};

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTypingEffect, setShowTypingEffect] = useState(false);
  const { toast } = useToast();

  // Form definition
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Button animation on submit
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }
    
    try {
      await apiRequest("POST", "/api/contact", data);
      
      // Success animation
      if (formRef.current) {
        gsap.fromTo(formRef.current, 
          { boxShadow: "0 0 10px rgba(58, 134, 255, 0.5)" },
          { boxShadow: "0 0 0px rgba(58, 134, 255, 0)", duration: 1.5 }
        );
      }
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
        variant: "default",
      });
      
      // Reset form with animation
      gsap.to(form.getValues(), {
        duration: 0, // Instant
        onComplete: () => {
          form.reset();
          setShowTypingEffect(true);
          setTimeout(() => setShowTypingEffect(false), 3000);
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Error animation
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { x: 0 },
          { x: 10, duration: 0.1, repeat: 3, yoyo: true }
        );
      }
      
      toast({
        title: "Error sending message",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    
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
    if (headingRef.current) {
      tl.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      });
    }

    // Info animation
    if (infoRef.current) {
      tl.from(infoRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.8,
      }, "-=0.4");
    }

    // Form animation
    if (formRef.current) {
      tl.from(formRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.8,
      }, "-=0.4");
    }

    // Blob animation
    const blob = sectionRef.current?.querySelector('.blob');
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
    
    // Form input focus animations
    const inputs = document.querySelectorAll('.form-input-container');
    inputs.forEach(input => {
      const inputElement = input as HTMLElement;
      
      inputElement.addEventListener('focus', () => {
        gsap.to(inputElement, {
          boxShadow: "0 0 0 2px rgba(58, 134, 255, 0.4)",
          duration: 0.3
        });
      }, true);
      
      inputElement.addEventListener('blur', () => {
        gsap.to(inputElement, {
          boxShadow: "none",
          duration: 0.3
        });
      }, true);
    });
    
    // Initially, show typing effect
    setShowTypingEffect(true);
    setTimeout(() => setShowTypingEffect(false), 3000);
  }, []);

  // Social links with their colors
  const socialLinks = [
    { icon: <Linkedin className="h-5 w-5" />, href: "#", color: "#0077B5", delay: 0 },
    { icon: <Github className="h-5 w-5" />, href: "#", color: "#2D333B", delay: 0.1 },
    { icon: <Twitter className="h-5 w-5" />, href: "#", color: "#1DA1F2", delay: 0.2 },
    { icon: <Dribbble className="h-5 w-5" />, href: "#", color: "#EA4C89", delay: 0.3 },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 relative"
    >
      {/* Animated connected lines */}
      <ConnectionLines />
      
      {/* Decoration elements */}
      <div className="blob bg-primary/20 w-80 h-80 right-0 top-20"></div>
      <div className="blob bg-secondary/20 w-60 h-60 left-20 bottom-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="section-heading mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3 flex items-center">
            <MessagesSquare className="mr-3 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary"></div>
          
          {/* Terminal-inspired subtitle */}
          <div className="mt-4 p-3 bg-gray-900/50 rounded-md font-mono text-xs sm:text-sm border border-gray-800">
            <div className="text-primary flex items-center">
              <Terminal className="h-4 w-4 mr-2" />
              <span>$ contact --init</span>
            </div>
            <div className="mt-1 text-light/80">
              {showTypingEffect ? (
                <TypeEffect text="Ready to collaborate on your next project? Send me a message and let's create something amazing together!" />
              ) : (
                "Ready to collaborate on your next project? Send me a message and let's create something amazing together!"
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
          <div ref={infoRef} className="contact-info bg-dark/30 p-6 rounded-lg backdrop-blur-sm border border-gray-800/50">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Contact Information
              </span>
            </h3>
            
            {/* Contact info items with animated icons */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start group">
                <div className="bg-primary/10 rounded-full p-3 mr-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Location</h4>
                  <p className="text-light/70">{resume.location}</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="bg-primary/10 rounded-full p-3 mr-4 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Email</h4>
                  <p className="text-light/70">{resume.email}</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="bg-primary/10 rounded-full p-3 mr-4 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Phone</h4>
                  <p className="text-light/70">{resume.phone}</p>
                </div>
              </div>
            </div>
            
            {/* Social links */}
            <div className="social-links">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Connect With Me
              </h4>
              
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <AnimatedSocialButton 
                    key={index}
                    icon={link.icon}
                    href={link.href}
                    color={link.color}
                    delay={link.delay}
                  />
                ))}
              </div>
            </div>
            
            {/* Code snippet */}
            <div className="mt-8 text-xs font-mono bg-gray-900 p-3 rounded border border-gray-700 overflow-hidden">
              <div className="opacity-70">
                <div>
                  <span className="text-pink-400">const</span>
                  <span className="text-blue-400"> contact</span>
                  <span className="text-white"> = </span>
                  <span className="text-orange-400">async</span>
                  <span className="text-white"> () =&gt; &#123;</span>
                </div>
                <div className="ml-4">
                  <span className="text-white">await </span>
                  <span className="text-green-400">sendMessage</span>
                  <span className="text-white">(</span>
                  <span className="text-yellow-300">'Hello Archie!'</span>
                  <span className="text-white">);</span>
                </div>
                <div>
                  <span className="text-white">&#125;;</span>
                </div>
              </div>
            </div>
          </div>
          
          <div ref={formRef} className="contact-form bg-dark/30 p-6 rounded-lg backdrop-blur-sm border border-gray-800/50 relative overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <SendHorizontal className="h-5 w-5 mr-2 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Send Me a Message
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center">
                          <span className="text-primary">&gt;</span> Name
                        </FormLabel>
                        <FormControl>
                          <div className="form-input-container">
                            <Input 
                              placeholder="Your Name" 
                              className="bg-gray-900 border-gray-700 text-light focus-visible:ring-primary focus-visible:ring-1 transition-shadow" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center">
                          <span className="text-primary">&gt;</span> Email
                        </FormLabel>
                        <FormControl>
                          <div className="form-input-container">
                            <Input 
                              placeholder="Your Email" 
                              className="bg-gray-900 border-gray-700 text-light focus-visible:ring-primary focus-visible:ring-1 transition-shadow" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-sm font-medium flex items-center">
                        <span className="text-primary">&gt;</span> Subject
                      </FormLabel>
                      <FormControl>
                        <div className="form-input-container">
                          <Input 
                            placeholder="Subject" 
                            className="bg-gray-900 border-gray-700 text-light focus-visible:ring-primary focus-visible:ring-1 transition-shadow" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="text-sm font-medium flex items-center">
                        <span className="text-primary">&gt;</span> Message
                      </FormLabel>
                      <FormControl>
                        <div className="form-input-container">
                          <Textarea 
                            placeholder="Your Message" 
                            className="bg-gray-900 border-gray-700 text-light focus-visible:ring-primary focus-visible:ring-1 transition-shadow" 
                            rows={5} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  ref={btnRef}
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-light font-medium transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                  disabled={isSubmitting}
                >
                  <span className="flex items-center">
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </span>
                </Button>
                
                {/* Terminal-style status line */}
                <div className="mt-4 text-xs font-mono text-light/50">
                  <span className="text-green-400">$</span> {isSubmitting ? 'Sending message...' : 'Ready to send'}
                  <span className="cursor-blink ml-1">|</span>
                </div>
              </form>
            </Form>
            
            {/* Background decorative code */}
            <div className="absolute -bottom-10 -right-10 text-primary/5 font-mono text-5xl pointer-events-none">
              {`{...}`}
            </div>
            <div className="absolute -top-5 -left-5 text-primary/5 font-mono text-4xl pointer-events-none">
              {`</>`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
