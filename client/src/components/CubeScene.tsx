import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface CubeSceneProps {
  size?: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

const CubeScene = ({ 
  size = 100, 
  position = { x: 0, y: 0, z: 0 } 
}: CubeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

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
    renderer.setClearColor(0x000000, 0);
    
    // Append to DOM
    mountRef.current.appendChild(renderer.domElement);
    
    // Create cube group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    
    // Add cubes with code-like textures
    const createCube = (color: string, pos: THREE.Vector3, size: number = 1) => {
      // Create a canvas for the texture
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Fill with color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 256, 256);
        
        // Add code-like text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        
        // Create code-like pattern
        const lines = [
          'function init() {',
          '  const x = 0;',
          '  return x + y;',
          '}',
          '',
          'class Cube {',
          '  render() {',
          '    if (x > 0) {',
          '      rotate(x, y);',
          '    }',
          '  }',
          '}',
          '',
          'const animate = () => {',
          '  requestAnimationFrame();',
          '  rotation += 0.01;',
          '};'
        ];
        
        lines.forEach((line, index) => {
          ctx.fillText(line, 10, 20 + (index * 15));
        });
      }
      
      // Create texture
      const texture = new THREE.CanvasTexture(canvas);
      
      // Create material with texture
      const materials = [
        new THREE.MeshBasicMaterial({ color, opacity: 0.8, transparent: true }),
        new THREE.MeshBasicMaterial({ color, opacity: 0.8, transparent: true }),
        new THREE.MeshBasicMaterial({ color, opacity: 0.8, transparent: true }),
        new THREE.MeshBasicMaterial({ color, opacity: 0.8, transparent: true }),
        new THREE.MeshBasicMaterial({ map: texture, opacity: 0.9, transparent: true }),
        new THREE.MeshBasicMaterial({ map: texture, opacity: 0.9, transparent: true })
      ];
      
      // Create cube
      const geometry = new THREE.BoxGeometry(size, size, size);
      const cube = new THREE.Mesh(geometry, materials);
      cube.position.copy(pos);
      
      return cube;
    };
    
    // Main cube
    const mainCube = createCube('#3a86ff', new THREE.Vector3(0, 0, 0), 1);
    cubeGroup.add(mainCube);
    
    // Small accent cubes
    const smallCube1 = createCube('#ff006e', new THREE.Vector3(1.2, 1.2, 0), 0.4);
    const smallCube2 = createCube('#ffbe0b', new THREE.Vector3(-1.2, -1.2, 0), 0.4);
    cubeGroup.add(smallCube1, smallCube2);
    
    // Set cube position
    cubeGroup.position.set(position.x, position.y, position.z);
    
    // Animate with GSAP
    gsap.to(cubeGroup.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the window
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Add slight tilt based on mouse position
      gsap.to(cubeGroup.rotation, {
        x: cubeGroup.rotation.x + (mouseY * 0.01),
        y: cubeGroup.rotation.y + (mouseX * 0.01),
        duration: 0.5
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, position]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default CubeScene;