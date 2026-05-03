const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // If gsap is used but not imported
  if (content.includes('gsap.') && !content.includes('import { gsap }')) {
    content = content.replace(/^(import React.*?)$/m, '$1\nimport { gsap } from "gsap";');
  }

  // If ScrollTrigger is used but not imported
  if (content.includes('ScrollTrigger') && !content.includes('import { ScrollTrigger }')) {
    content = content.replace(/^(import React.*?)$/m, '$1\nimport { ScrollTrigger } from "gsap/ScrollTrigger";');
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("GSAP imports updated.");
