import{r as i,g as c,j as a}from"./index-CmjsBaUU.js";const m=768;function w(){const[r,s]=i.useState(void 0);return i.useEffect(()=>{const l=window.matchMedia(`(max-width: ${m-1}px)`),n=()=>{s(window.innerWidth<m)};return l.addEventListener("change",n),s(window.innerWidth<m),()=>l.removeEventListener("change",n)},[]),!!r}const E=({direction:r="left",speed:s=30,className:l=""})=>{const n=i.useRef(null),d=i.useRef(null),u=w(),f=[`function animateElements() {
  gsap.from(elements, {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 1
  });
}`,`const data = fetch('/api/projects')
  .then(res => res.json())
  .then(data => renderProjects(data));`,`class DeveloperPortfolio {
  constructor() {
    this.init();
  }
  
  init() {
    this.createAnimations();
    this.bindEvents();
  }
}`,`document.querySelectorAll('.project')
  .forEach(project => {
    project.addEventListener('mouseenter', 
      handleProjectHover);
  });`,`import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  return { theme, setTheme };
}`];return i.useEffect(()=>{if(!n.current||!d.current)return;const e=d.current,t=e.offsetWidth,o=e.cloneNode(!0);n.current.appendChild(o),r==="left"?c.set(o,{left:t}):(c.set(e,{left:t}),c.set(o,{left:0}));const h=t/(s*(u?.5:1)),p=r==="left"?-1:1;return c.to([e,o],{x:p*t,duration:h,repeat:-1,ease:"none",modifiers:{x:x=>`${parseFloat(x)%t}px`}}),()=>{c.killTweensOf([e,o])}},[r,s,u]),a.jsx("div",{ref:n,className:`code-scroll-container relative overflow-hidden whitespace-nowrap ${l}`,children:a.jsx("div",{ref:d,className:"code-scroll-track inline-block",children:f.map((e,t)=>a.jsx("div",{className:"inline-block bg-dark/80 border border-gray-700 rounded-md p-3 mx-4 align-top",children:a.jsx("pre",{className:"text-xs md:text-sm font-mono overflow-x-auto max-w-xs md:max-w-md whitespace-pre-wrap",children:a.jsx("code",{className:"text-light",children:e})})},t))})})};export{E as S};
