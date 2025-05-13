import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface Terrain3DProps {
  opacity?: number;
}

const Terrain3D = ({ opacity = 0.3 }: Terrain3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Append to DOM
    containerRef.current.appendChild(renderer.domElement);
    
    // Create terrain
    const planeGeometry = new THREE.PlaneGeometry(60, 60, 64, 64);
    
    // Create wireframe material with gradient
    const primaryColor = new THREE.Color('#3a86ff');
    const secondaryColor = new THREE.Color('#ff006e');
    
    // Create a gradient texture
    const createGradientTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      const gradient = context.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#3a86ff');
      gradient.addColorStop(1, '#ff006e');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
      
      return new THREE.CanvasTexture(canvas);
    };
    
    const gradientTexture = createGradientTexture();
    
    // Material
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: opacity,
      map: gradientTexture
    });
    
    // Create mesh
    const terrain = new THREE.Mesh(planeGeometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -10;
    scene.add(terrain);
    
    // Add a grid helper
    const gridHelper = new THREE.GridHelper(60, 60, primaryColor, secondaryColor);
    gridHelper.position.y = -10;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = opacity * 0.5;
    scene.add(gridHelper);
    
    // Get the vertices of the plane
    const vertices = planeGeometry.attributes.position;
    
    // Modify the vertices to create peaks and valleys
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      
      // Create a wave pattern
      const waveX = Math.sin(x / 3) * 2;
      const waveY = Math.cos(y / 3) * 2;
      
      // Set the z-coordinate (height)
      vertices.setZ(i, waveX + waveY);
    }
    
    // Update the geometry
    vertices.needsUpdate = true;
    
    // Animate the terrain
    const animate = () => {
      const now = Date.now() * 0.001; // Convert to seconds
      
      // Update each vertex position
      for (let i = 0; i < vertices.count; i++) {
        const x = vertices.getX(i);
        const y = vertices.getY(i);
        
        // Create a wave pattern that changes over time
        const waveX = Math.sin(x / 3 + now) * 2;
        const waveY = Math.cos(y / 3 + now) * 2;
        
        // Set the z-coordinate (height)
        vertices.setZ(i, waveX + waveY);
      }
      
      // Update the geometry
      vertices.needsUpdate = true;
      
      // Rotate the terrain slightly
      terrain.rotation.z += 0.0005;
      gridHelper.rotation.y += 0.0005;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      gsap.to(camera.position, {
        x: mouseX * 5,
        y: 15 + mouseY * 2,
        duration: 1,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [opacity]);
  
  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-[-3] pointer-events-none"
    />
  );
};

export default Terrain3D;