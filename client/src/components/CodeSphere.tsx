import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGSAP } from '@/lib/useGSAP';
import gsap from 'gsap';

interface CodeSphereProps {
  size?: number;
  position?: {
    x: number;
    y: number;
  };
  opacity?: number;
}

const CodeSphere = ({ 
  size = 180, 
  position = { x: 0, y: 0 },
  opacity = 0.7 
}: CodeSphereProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const themeObserverRef = useRef<MutationObserver | null>(null);
  
  // Sphere animation setup
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    
    // Custom shader material for code-like effect
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        opacity: { value: opacity },
        color1: { value: new THREE.Color('#3a86ff') },
        color2: { value: new THREE.Color('#ff006e') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
          // Create grid pattern
          float gridSize = 20.0;
          vec2 grid = fract(vUv * gridSize);
          float gridLine = step(0.95, grid.x) + step(0.95, grid.y);
          
          // Animate some dots that look like code/data
          float dotEffect = step(0.995, random(floor(vUv * gridSize) + floor(time * 2.0)));
          
          // Mix the two colors based on position
          vec3 finalColor = mix(color1, color2, vUv.y);
          
          // Sphere edge fading
          float edge = 1.0 - length(vPosition.xy) / 2.0;
          
          // Combine effects
          float alpha = (gridLine * 0.3 + dotEffect * 0.7) * opacity * edge;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    });
    
    // Create mesh and add to scene
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Animation loop
    let animationFrameId: number;
    let time = 0;
    
    const animate = () => {
      time += 0.01;
      (material.uniforms.time as { value: number }).value = time;
      
      sphere.rotation.y = time * 0.1;
      sphere.rotation.x = time * 0.05;
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Update color based on theme changes
    const updateColors = () => {
      const isDarkTheme = !document.body.classList.contains('light-theme');
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();
      
      gsap.to(material.uniforms.color1.value, {
        r: new THREE.Color(primaryColor).r,
        g: new THREE.Color(primaryColor).g,
        b: new THREE.Color(primaryColor).b,
        duration: 0.5
      });
      
      gsap.to(material.uniforms.color2.value, {
        r: new THREE.Color(secondaryColor).r,
        g: new THREE.Color(secondaryColor).g,
        b: new THREE.Color(secondaryColor).b,
        duration: 0.5
      });
    };
    
    // Initial color update
    updateColors();
    
    // Watch for theme changes
    themeObserverRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          updateColors();
        }
      });
    });
    
    themeObserverRef.current.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Initial animation
    gsap.from(sphere.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      delay: 0.2
    });
    
    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (themeObserverRef.current) {
        themeObserverRef.current.disconnect();
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size, opacity]);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default CodeSphere;