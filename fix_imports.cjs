const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // The user explicitly wants this exact string replaced:
  // import React from "react"; or import React from 'react';
  
  // Let's replace any import React from "react" or 'react' that doesn't have hooks
  content = content.replace(/^import\s+React\s+from\s+['"]react['"];?/m, 'import React, { useRef, useEffect, useState, useLayoutEffect, useMemo, useCallback } from "react";');
  
  // Also, the user manually did `import React, { useRef, useEffect } from "react";` in Experience.jsx
  // Let's replace all variations that don't match the required full one, just to be safe:
  // But wait, the user said: "If any of these hooks are used but NOT imported, fix the import statement."
  // And: "Replace incorrect imports like: import React from "react"; WITH: import React, { useRef, ... }"
  
  content = content.replace(/^import\s+React\s*,\s*\{\s*useRef,\s*useEffect\s*\}\s*from\s*['"]react['"];?/m, 'import React, { useRef, useEffect, useState, useLayoutEffect, useMemo, useCallback } from "react";');
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("Imports updated.");
