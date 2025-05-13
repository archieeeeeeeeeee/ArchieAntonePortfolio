export const COLORS = {
  primary: '#3a86ff',
  secondary: '#ff006e',
  accent: '#ffbe0b',
  dark: '#121212',
  light: '#fafafa'
};

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/',
  github: 'https://github.com/',
  twitter: 'https://twitter.com/',
  dribbble: 'https://dribbble.com/'
};

export const RESUME_FILE_URL = '/resume.pdf';

export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const ANIMATION_CONFIG = {
  headerAnimation: {
    duration: 0.8,
    y: 30,
    opacity: 0,
    ease: 'power3.out'
  },
  contentAnimation: {
    duration: 0.8,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.2
  },
  staggerAnimation: {
    duration: 0.5,
    y: 20,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out'
  }
};
