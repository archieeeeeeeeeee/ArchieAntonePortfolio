import { useEffect, useRef, useState } from "react";
import { MapPin, Mail, Phone, Linkedin, Github, Twitter, Dribbble } from "lucide-react";
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

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    try {
      await apiRequest("POST", "/api/contact", data);
      
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      
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

    // Info animation
    tl.from(infoRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.8,
    }, "-=0.4");

    // Form animation
    tl.from(formRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.8,
    }, "-=0.4");

    // Social links animation
    const socialLinks = infoRef.current?.querySelectorAll('.social-link');
    if (socialLinks) {
      gsap.from(socialLinks, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: socialLinks,
          start: "top 90%",
        },
      });
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 relative"
    >
      <div className="blob bg-primary/20 w-80 h-80 right-0 top-20"></div>
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="section-heading mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-3">Get In Touch</h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div ref={infoRef} className="contact-info">
            <h3 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Contact Information
            </h3>
            
            <div className="mb-8">
              <p className="text-lg mb-6">
                Have a question or want to work together? Feel free to contact me using the form or through the contact details below.
              </p>
            </div>
            
            <div className="flex items-start mb-6">
              <div className="bg-primary/20 rounded-full p-3 mr-4">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Location</h4>
                <p className="text-light/70">{resume.location}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-6">
              <div className="bg-primary/20 rounded-full p-3 mr-4">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Email</h4>
                <p className="text-light/70">{resume.email}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="bg-primary/20 rounded-full p-3 mr-4">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Phone</h4>
                <p className="text-light/70">{resume.phone}</p>
              </div>
            </div>
            
            <div className="social-links">
              <h4 className="text-lg font-medium mb-4">Connect With Me</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="social-link bg-primary/20 hover:bg-primary/30 text-primary rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="social-link bg-primary/20 hover:bg-primary/30 text-primary rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="social-link bg-primary/20 hover:bg-primary/30 text-primary rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="social-link bg-primary/20 hover:bg-primary/30 text-primary rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <Dribbble className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div ref={formRef} className="contact-form">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="bg-dark/80 p-8 rounded-lg border border-gray-800"
              >
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Send Me a Message
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Name" 
                            className="bg-gray-800 border-gray-700 text-light focus:ring-primary focus:border-primary" 
                            {...field} 
                          />
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
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Email" 
                            className="bg-gray-800 border-gray-700 text-light focus:ring-primary focus:border-primary" 
                            {...field} 
                          />
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
                      <FormLabel className="text-sm font-medium">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Subject" 
                          className="bg-gray-800 border-gray-700 text-light focus:ring-primary focus:border-primary" 
                          {...field} 
                        />
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
                      <FormLabel className="text-sm font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your Message" 
                          className="bg-gray-800 border-gray-700 text-light focus:ring-primary focus:border-primary" 
                          rows={5} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-light font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
