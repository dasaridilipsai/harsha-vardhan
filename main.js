// --- 1. Smooth Scrolling Physics (Lenis) ---
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
    smooth: true,
    mouseMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// Integrate Lenis with GSAP Ticker for perfect sync
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

// Standard 16:9 1080p canvas
canvas.width = 1920;
canvas.height = 1080;

// --- 1. Scene-based Architecture ---
const scenes = [
    { path: '/frames/scene1/', count: 72 },
    { path: '/frames/scene5/', count: 72 }
];

// Calculate total frames globally
const totalFrames = scenes.reduce((sum, scene) => sum + scene.count, 0);

// Global State
const images = new Array(totalFrames).fill(null);
const frameData = { frame: 0 };

// --- 2. Dynamic Frame Loading ---
// Maps an absolute continuous index to a specific scene and frame file
function getFramePath(absoluteIndex) {
    let accumulated = 0;
    for (const scene of scenes) {
        if (absoluteIndex < accumulated + scene.count) {
            const localIndex = absoluteIndex - accumulated + 1; // Frames are 1-indexed (001)
            const formattedIndex = localIndex.toString().padStart(3, '0');
            return `${scene.path}frame_${formattedIndex}.jpg`;
        }
        accumulated += scene.count;
    }
    return ''; // Should not be reached
}

// --- 3. Performance: Lazy Load Strategy ---
function loadFramesAround(centerIndex) {
    const prefetchAhead = 15; // Load next 15 frames ahead of scroll
    const prefetchBehind = 5; // Keep 5 loaded behind in case of scrolling back
    
    const start = Math.max(0, centerIndex - prefetchBehind);
    const end = Math.min(totalFrames - 1, centerIndex + prefetchAhead);

    for (let i = start; i <= end; i++) {
        if (!images[i]) {
            const img = new Image();
            img.src = getFramePath(i);
            images[i] = img; // Assign to array immediately so we don't trigger loading twice
        }
    }
}

// Initial Loader: Ensure first chunk is loaded before removing loading screen
function initLoader() {
    if (totalFrames === 0) return loadingComplete();

    const initialLoadCount = Math.min(10, totalFrames); // Boot up with 10 frames
    let loaded = 0;

    for (let i = 0; i < initialLoadCount; i++) {
        const img = new Image();
        img.onload = checkInitialLoad;
        img.onerror = () => {
            console.warn(`[SYSTEM] Frame missing: ${getFramePath(i)}`);
            checkInitialLoad(); // Proceed to prevent stalling
        };
        img.src = getFramePath(i);
        images[i] = img;
    }

    function checkInitialLoad() {
        loaded++;
        const percent = Math.floor((loaded / initialLoadCount) * 100);
        
        const progressText = document.getElementById("progress-text");
        const progressFill = document.getElementById("progress-fill");
        
        if (progressText) progressText.innerText = `${percent}%`;
        if (progressFill) progressFill.style.width = `${percent}%`;

        if (loaded === initialLoadCount) {
            loadingComplete();
        }
    }
}

function loadingComplete() {
    gsap.to("#loading-screen", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            const loader = document.getElementById("loading-screen");
            if(loader) loader.style.display = "none";
        }
    });
    
    render();
    initScroll();
}

// --- 4. Error Handling: Nearest Loaded Frame ---
function getNearestLoadedFrame(targetIndex) {
    // Exact match is ready
    if (images[targetIndex] && images[targetIndex].complete && images[targetIndex].naturalWidth > 0) {
        return images[targetIndex];
    }
    
    // Search outwards for nearest available frame to prevent canvas crashing or blinking
    for (let offset = 1; offset < totalFrames; offset++) {
        const left = targetIndex - offset;
        const right = targetIndex + offset;
        
        if (left >= 0 && images[left] && images[left].complete && images[left].naturalWidth > 0) return images[left];
        if (right < totalFrames && images[right] && images[right].complete && images[right].naturalWidth > 0) return images[right];
    }
    return null;
}

// --- 5. Smooth Rendering ---
function render() {
    const targetFrame = Math.round(frameData.frame);
    
    // Trigger lazy load for frames coming up in the scroll
    loadFramesAround(targetFrame);
    
    const imgToDraw = getNearestLoadedFrame(targetFrame);
    
    if (imgToDraw) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imgToDraw, 0, 0, canvas.width, canvas.height);
    }
}

// --- 6. Cinematic Scroll Architecture ---
function initScroll() {
    // Dynamic Motion Blur mapped to scroll velocity
    const canvasContainer = document.querySelector('.canvas-container');
    
    // Master timeline mapped to the hero section scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2, // Inertia scrub interpolation (Apple/Tesla feel)
            onUpdate: (self) => {
                render(); // Paint frame
                
                // Motion Blur effect on fast scroll
                const velocity = Math.abs(self.getVelocity());
                if (velocity > 50) {
                    const blurAmount = Math.min(velocity / 100, 4); // Max 4px blur
                    canvasContainer.style.filter = `blur(${blurAmount}px)`;
                } else {
                    canvasContainer.style.filter = 'blur(0px)';
                }
            }
        }
    });

    // We have 144 totalFrames.
    // Intro: 0-30
    // Build-up: 35-65
    // Transition (Scene Boundary): 65-75
    // Highlight: 80-110
    // Calm / Resolve: 115-144

    // 1. FRAME INTERPOLATION
    tl.to(frameData, {
        frame: totalFrames - 1,
        ease: "none",
        duration: totalFrames
    }, 0);

    // 2. DEPTH & PARALLAX (Continuous slight zoom)
    tl.fromTo(canvas, 
        { scale: 1 }, 
        { scale: 1.15, ease: "none", duration: totalFrames }, 
        0
    );

    // 3. CINEMATIC SCENE TRANSITIONS (Boundary at frame 72)
    let accumulatedFrames = 0;
    for (let i = 0; i < scenes.length - 1; i++) {
        accumulatedFrames += scenes[i].count;
        const transLen = 16;
        
        // Scene Exit
        tl.to(canvas, {
            opacity: 0.3,
            scale: 1.18, // Extra zoom bump during transition
            duration: transLen / 2,
            ease: "power2.in"
        }, accumulatedFrames - (transLen / 2));
        
        // Scene Enter
        tl.to(canvas, {
            opacity: 1,
            scale: 1.15, // Return to normal parallax path
            duration: transLen / 2,
            ease: "power2.out"
        }, accumulatedFrames);
    }

    // 4. STORY SEQUENCE (Text Synchronization)
    
    // STORY 1: INTRO (0-30)
    tl.fromTo("#story-intro", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 10, ease: "power2.out" }, 
        0
    );
    tl.to("#story-intro", 
        { y: -30, opacity: 0, duration: 10, ease: "power2.in" }, 
        20
    );

    // STORY 2: BUILD-UP (35-65)
    tl.fromTo("#story-buildup", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 10, ease: "power2.out" }, 
        35
    );
    tl.to("#story-buildup", 
        { y: -30, opacity: 0, duration: 10, ease: "power2.in" }, 
        55
    );

    // STORY 3: HIGHLIGHT MOMENT (80-110)
    tl.fromTo("#story-highlight", 
        { scale: 0.95, y: 30, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 12, ease: "back.out(1.2)" }, 
        75
    );
    // Glow effect peaks during highlight
    tl.to(".hero-glow", { opacity: 1, duration: 12, ease: "power2.out" }, 75);
    tl.to("#story-highlight", 
        { y: -30, opacity: 0, duration: 10, ease: "power2.in" }, 
        100
    );
    tl.to(".hero-glow", { opacity: 0, duration: 10, ease: "power2.in" }, 100);

    // STORY 4: CALM / RESOLVE (115-144)
    tl.fromTo("#story-resolve", 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 10, ease: "power2.out" }, 
        115
    );
    tl.to("#story-resolve", 
        { y: -80, opacity: 0, duration: 15, ease: "power3.in" }, 
        totalFrames - 15
    );

    // 5. Scroll Progress Bar
    gsap.to(".scroll-progress-fill", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1
        }
    });

    // 6. Subsequent Content Reveal Animations (Staggered Premium Feel)
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(sec => {
        const elements = sec.querySelectorAll(".section-title, .section-text, .project-card, .cta-btn");
        
        gsap.fromTo(elements, 
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sec,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

// --- 7. Premium Custom Cursor ---
function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if(!cursor || !cursorDot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Dot follows instantly
        gsap.set(cursorDot, { x: mouseX, y: mouseY });
    });

    // Ring follows with inertia lag
    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        gsap.set(cursor, { x: cursorX, y: cursorY });
    });

    // Interactive Hover States
    const interactables = document.querySelectorAll('a, button, .project-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover-state'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover-state'));
        
        // Micro-bounce click feedback
        el.addEventListener('mousedown', () => gsap.to(el, { scale: 0.96, duration: 0.1, ease: "power1.out" }));
        el.addEventListener('mouseup', () => gsap.to(el, { scale: 1, duration: 0.4, ease: "back.out(1.5)" }));
        el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.4, ease: "back.out(1.5)" }));
    });
}

// Kickoff Boot Sequence
initCursor();
initLoader();
