import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import ScrollDemo from './scroll';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const config = {
      colors: {
        bg: 0x000000,
        primary: 0x6366f1, // Indigo 500
        secondary: 0xc7d2fe, // Indigo 200
        wireframe: 0x0f172a
      }
    };

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.colors.bg);
    scene.fog = new THREE.FogExp2(config.colors.bg, 0.035);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
      powerPreference: "high-performance",
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const geometryCore = new THREE.IcosahedronGeometry(2, 10);
    const materialCore = new THREE.MeshPhysicalMaterial({
      color: 0x000000, metalness: 0.8, roughness: 0.2, transmission: 0, clearcoat: 1.0, clearcoatRoughness: 0.1, emissive: config.colors.primary, emissiveIntensity: 0.1
    });
    const sphereCore = new THREE.Mesh(geometryCore, materialCore);
    sphereCore.visible = false;
    mainGroup.add(sphereCore);

    const geometryWire = new THREE.IcosahedronGeometry(2.2, 2);
    const materialWire = new THREE.MeshBasicMaterial({
      color: config.colors.primary, wireframe: true, transparent: true, opacity: 0.15, side: THREE.DoubleSide
    });
    const sphereWire = new THREE.Mesh(geometryWire, materialWire);
    sphereWire.visible = false;
    mainGroup.add(sphereWire);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 12;
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.04, color: config.colors.primary, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const explosionCount = 5000;
    const explosionGeo = new THREE.BufferGeometry();
    const initialPos = new Float32Array(explosionCount * 3);
    const targetPos = new Float32Array(explosionCount * 3);
    const currentPos = new Float32Array(explosionCount * 3);

    for (let i = 0; i < explosionCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / explosionCount);
      const theta = Math.sqrt(explosionCount * Math.PI) * phi;
      const r = 2.0;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      initialPos[i * 3] = x; initialPos[i * 3 + 1] = y; initialPos[i * 3 + 2] = z;
      currentPos[i * 3] = x; currentPos[i * 3 + 1] = y; currentPos[i * 3 + 2] = z;
      const dir = new THREE.Vector3(x, y, z).normalize();
      const dist = 2.0 + Math.random() * 6.0;
      targetPos[i * 3] = dir.x * dist; targetPos[i * 3 + 1] = dir.y * dist; targetPos[i * 3 + 2] = dir.z * dist;
    }
    explosionGeo.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
    const explosionMaterial = new THREE.PointsMaterial({ size: 0.04, color: config.colors.primary, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const explosionSystem = new THREE.Points(explosionGeo, explosionMaterial);
    explosionSystem.visible = true;
    mainGroup.add(explosionSystem);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const light1 = new THREE.PointLight(config.colors.primary, 400);
    light1.position.set(4, 2, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(config.colors.secondary, 400);
    light2.position.set(-4, -2, 2);
    scene.add(light2);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.strength = 2.0; bloomPass.radius = 0.6; bloomPass.threshold = 0.05;
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    let isAnimating = false;
    const animState = { progress: 0 };

    function updateExplosion() {
      const positions = explosionGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < explosionCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        positions[ix] = initialPos[ix] + (targetPos[ix] - initialPos[ix]) * animState.progress;
        positions[iy] = initialPos[iy] + (targetPos[iy] - initialPos[iy]) * animState.progress;
        positions[iz] = initialPos[iz] + (targetPos[iz] - initialPos[iz]) * animState.progress;
        if (animState.progress > 0.01) {
          const angle = animState.progress * 0.5;
          const x = positions[ix], z = positions[iz];
          positions[ix] = x * Math.cos(angle) - z * Math.sin(angle);
          positions[iz] = x * Math.sin(angle) + z * Math.cos(angle);
        }
      }
      explosionGeo.attributes.position.needsUpdate = true;
    }

    const onMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
      const coords = document.getElementById('coords');
      if (coords) coords.innerText = `v2024.1.${Math.floor((event.clientX / window.innerWidth) * 100)}.${Math.floor((event.clientY / window.innerHeight) * 100)}`;
    };

    const onClick = () => {
      if (!isAnimating) {
        isAnimating = true;
        const statusLight = document.getElementById('status-light');
        const statusText = document.getElementById('status-text');
        if (statusLight && statusText) {
          statusLight.classList.remove('bg-indigo-500'); statusLight.classList.add('bg-white');
          statusText.innerText = "Status: Compiling...";
          statusText.classList.remove('text-indigo-400/80'); statusText.classList.add('text-white');
        }

        gsap.to(animState, {
          progress: 1, duration: 1.5, ease: "power4.out", onUpdate: updateExplosion,
          onComplete: () => {
            gsap.to(animState, {
              progress: 0, duration: 2, delay: 0.2, ease: "elastic.out(1, 0.5)", onUpdate: updateExplosion,
              onComplete: () => {
                isAnimating = false;
                if (statusLight && statusText) {
                  statusLight.classList.add('bg-indigo-500'); statusLight.classList.remove('bg-white');
                  statusText.innerText = "Engine: Ready";
                  statusText.classList.add('text-indigo-400/80'); statusText.classList.remove('text-white');
                }
              }
            });
          }
        });
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    function animate() {
      const elapsedTime = clock.getElapsedTime();
      targetX = mouseX * 0.001; targetY = mouseY * 0.001;
      if (!isAnimating || animState.progress < 0.5) {
        mainGroup.rotation.y += 0.002; mainGroup.rotation.x += 0.001;
      }
      mainGroup.rotation.y += 0.05 * (targetX - mainGroup.rotation.y);
      mainGroup.rotation.x += 0.05 * (targetY - mainGroup.rotation.x);
      if (!isAnimating) {
        const breathe = 1 + Math.sin(elapsedTime * 1.5) * 0.015;
        explosionSystem.scale.set(breathe, breathe, breathe);
      }
      light1.position.x = Math.sin(elapsedTime * 0.7) * 4;
      light1.position.y = Math.cos(elapsedTime * 0.5) * 4;
      light2.position.x = Math.cos(elapsedTime * 0.3) * 5;
      light2.position.z = Math.sin(elapsedTime * 0.5) * 5;
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = -mouseY * 0.0002;
      composer.render();
      animationFrameId = requestAnimationFrame(animate);
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // Init
    animate();
    const tl = gsap.timeline();
    tl.to("#loader", {
      opacity: 0, duration: 0.8, onComplete: () => {
        const l = document.getElementById("loader"); if (l) l.style.display = "none";
      }
    })
      .fromTo(explosionSystem.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.5, ease: "elastic.out(1, 0.7)" }, "-=0.5")
      .to(".nav-item", { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=1")
      .fromTo(".hero-reveal", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out" }, "-=0.8");

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      composer.dispose();
      document.body.style.cursor = 'default';
      tl.kill();
    };
  }, []);

  useEffect(() => {
    // Glitch effect
    const t = document.querySelectorAll('.glitch-target');
    let lX = 0, lY = 0, lT = 0;
    const onGlitchMouseMove = (e: MouseEvent) => {
      const now = Date.now(), dt = now - lT;
      if (dt > 30) {
        const dx = e.clientX - lX, dy = e.clientY - lY, s = Math.sqrt(dx * dx + dy * dy) / dt;
        if (s > 2.5) {
          t.forEach(el => {
            if (!el.classList.contains('glitch-active')) {
              el.classList.add('glitch-active');
              setTimeout(() => el.classList.remove('glitch-active'), 250);
            }
          });
        }
        lX = e.clientX; lY = e.clientY; lT = now;
      }
    };
    document.addEventListener('mousemove', onGlitchMouseMove);
    return () => document.removeEventListener('mousemove', onGlitchMouseMove);
  }, []);

  return (
    <section className="overflow-hidden antialiased selection:bg-indigo-500 selection:text-white text-zinc-300 font-sans bg-black w-full h-screen relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        .font-serif { font-family: 'Newsreader', serif; }
        .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
        .glitch-target { will-change: transform, text-shadow; backface-visibility: hidden; }
        .glitch-active { animation: glitch-anim 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        @keyframes glitch-anim {
          0% { transform: translate(0); text-shadow: none; }
          20% { transform: translate(-2px, 1px) skewX(-2deg); text-shadow: 2px 0 rgba(99, 102, 241, 0.3), -2px 0 rgba(255, 255, 255, 0.3); }
          40% { transform: translate(2px, -1px) skewX(2deg); text-shadow: -2px 0 rgba(99, 102, 241, 0.3), 2px 0 rgba(255, 255, 255, 0.3); }
          60% { transform: translate(-1px, 2px); }
          100% { transform: translate(0); text-shadow: none; }
        }
        .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); }
        /* Button Styles */
        .btn-wrapper{position:relative;display:inline-block}.btn{--border-radius:9999px;--padding:4px;--transition:0.4s;--button-color:#000;--highlight-color-hue:245deg;user-select:none;display:flex;align-items:center;justify-content:center;background-color:var(--button-color);box-shadow:inset 0px 1px 1px rgba(255,255,255,0.2),inset 0px 2px 2px rgba(255,255,255,0.15),inset 0px 4px 4px rgba(255,255,255,0.1),inset 0px 8px 8px rgba(255,255,255,0.05),0px -1px 1px rgba(0,0,0,0.02),0px -2px 2px rgba(0,0,0,0.03);border:solid 1px rgba(255,255,255,0.2);border-radius:var(--border-radius);cursor:pointer;transition:box-shadow var(--transition),border var(--transition),background-color var(--transition);padding:1rem 2rem}.btn::before{content:"";position:absolute;top:calc(0px - var(--padding));left:calc(0px - var(--padding));width:calc(100% + var(--padding)*2);height:calc(100% + var(--padding)*2);border-radius:calc(var(--border-radius) + var(--padding));pointer-events:none;background-image:linear-gradient(0deg,#0004,#000a);z-index:-1;transition:box-shadow var(--transition),filter var(--transition);box-shadow:0 -8px 8px -6px #0000 inset,0 -16px 16px -8px #00000000 inset,1px 1px 1px #fff2,2px 2px 2px #fff1,-1px -1px 1px #0002,-2px -2px 2px #0001}.btn::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background-image:linear-gradient(0deg,#fff,hsl(var(--highlight-color-hue),100%,70%),hsla(var(--highlight-color-hue),100%,70%,50%),8%,transparent);background-position:0 0;opacity:0;transition:opacity var(--transition),filter var(--transition)}.btn-letter{position:relative;display:inline-block;color:#ffffff90;font-family:'Inter',sans-serif;font-weight:600;font-size:0.875rem;letter-spacing:-0.025em;animation:letter-anim 2s ease-in-out infinite;transition:color var(--transition),text-shadow var(--transition),opacity var(--transition)}@keyframes letter-anim{50%{text-shadow:0 0 3px #ffffff88;color:#fff}}.btn-svg{flex-grow:0;width:18px;height:18px;margin-left:0.5rem;fill:none;stroke:#e8e8e8;stroke-width:2;animation:flicker 2s linear infinite;animation-delay:0.5s;filter:drop-shadow(0 0 2px #ffffff99);transition:stroke var(--transition),filter var(--transition),opacity var(--transition)}@keyframes flicker{50%{opacity:0.3}}.txt-wrapper{position:relative;display:flex;align-items:center;height:20px}.txt-1{display:flex;align-items:center;gap:1px}.btn:hover{border:solid 1px hsla(var(--highlight-color-hue),100%,80%,0.4)}.btn:hover::before{box-shadow:0 -8px 8px -6px #fffa inset,0 -16px 16px -8px hsla(var(--highlight-color-hue),100%,70%,0.3) inset,1px 1px 1px #fff2,2px 2px 2px #fff1,-1px -1px 1px #0002,-2px -2px 2px #0001}.btn:hover::after{opacity:1}.btn:hover .btn-svg{stroke:#fff;filter:drop-shadow(0 0 3px hsl(var(--highlight-color-hue),100%,70%)) drop-shadow(0 -4px 6px #0009);animation:none}.btn-letter:nth-child(1){animation-delay:0s}.btn-letter:nth-child(2){animation-delay:0.05s}.btn-letter:nth-child(3){animation-delay:0.1s}.btn-letter:nth-child(4){animation-delay:0.15s}.btn-letter:nth-child(5){animation-delay:0.2s}.btn-letter:nth-child(6){animation-delay:0.25s}.btn-letter:nth-child(7){animation-delay:0.3s}.btn-letter:nth-child(8){animation-delay:0.35s}.btn-letter:nth-child(9){animation-delay:0.4s}.btn-letter:nth-child(10){animation-delay:0.45s}.btn-letter:nth-child(11){animation-delay:0.5s}.btn-letter:nth-child(12){animation-delay:0.55s}.btn-letter:nth-child(13){animation-delay:0.6s}.btn-letter:nth-child(14){animation-delay:0.65s}.btn-letter:nth-child(15){animation-delay:0.7s}
      `}} />

      {/* Loader */}
      <div id="loader" className="absolute inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-zinc-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-indigo-500 w-full -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono">
            Engine Initialization
          </p>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer { 100% { transform: translateX(100%); } }
        `}} />
      </div>

      {/* WebGL Canvas Background */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="outline-none cursor-grab active:cursor-grabbing w-full h-full" id="webgl-canvas"></canvas>
      </div>

      {/* Hero UI */}
      <div className="z-10 flex flex-col pointer-events-none h-full relative pt-24">
        {/* Navbar */}


        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-24 pointer-events-none">
          <div className="max-w-5xl space-y-8">
            {/* Status */}
            <div className="overflow-hidden">
              <div className="hero-reveal flex items-center gap-3">
                <span id="status-light" className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-colors duration-300"></span>
                <p id="status-text" className="text-xs md:text-sm uppercase tracking-[0.2em] text-indigo-400/80 font-medium font-mono transition-colors duration-300">
                  Engine: Ready
                </p>
              </div>
            </div>

            {/* Headlines */}
            <div className="space-y-0">
              <div className="overflow-hidden">
                <h1 className="hero-reveal text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.95] text-white glitch-target mix-blend-difference">
                  Create,
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-reveal text-5xl md:text-7xl lg:text-8xl font-serif italic font-light tracking-tight leading-[0.95] text-indigo-200/90 glitch-target">
                  Worlds.
                </h1>
              </div>
            </div>

            {/* Description */}
            <div className="overflow-hidden max-w-xl">
              <p className="hero-reveal text-sm md:text-lg text-zinc-400 leading-relaxed font-light">
                The ultimate real-time 3D development platform. Forge, operate,
                and monetize interactive, real-time 3D experiences for any
                platform.
                <span className="text-indigo-400/70 text-xs block mt-2 font-mono uppercase tracking-widest opacity-80">
                  &gt; Start your creative journey
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="overflow-hidden pt-6">
              <div className="hero-reveal flex flex-wrap pointer-events-auto pt-4 pr-1 pb-4 pl-1 gap-x-4 gap-y-4">
                {/* Animated Install Button */}
                <div className="btn-wrapper">
                  <button className="btn" type="button" aria-label="Deploy Nexus">
                    <div className="txt-wrapper">
                      <div className="txt-1">
                        <span className="btn-letter">D</span>
                        <span className="btn-letter">o</span>
                        <span className="btn-letter">w</span>
                        <span className="btn-letter">n</span>
                        <span className="btn-letter">l</span>
                        <span className="btn-letter">o</span>
                        <span className="btn-letter">a</span>
                        <span className="btn-letter">d</span>
                        <span className="btn-letter" style={{ width: '4px' }}></span>
                        <span className="btn-letter">A</span>
                        <span className="btn-letter">e</span>
                        <span className="btn-letter">t</span>
                        <span className="btn-letter">h</span>
                        <span className="btn-letter">e</span>
                        <span className="btn-letter">r</span>
                      </div>
                    </div>
                    <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>
                {/* Secondary Button */}
                <button className="group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] h-[54px] rounded-full pt-[1px] pr-[1px] pb-[1px] pl-[1px] relative items-center justify-center">
                  <span className="animate-[spin_4s_linear_infinite] transition-opacity duration-300 group-hover:opacity-100 opacity-0 absolute top-[-150%] left-[-150%] w-[400%] h-[400%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#6366f1_100%)]"></span>
                  <span className="absolute inset-0 rounded-full bg-white/10 transition-opacity duration-300 group-hover:opacity-0"></span>
                  <span className="flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-indigo-200 text-sm font-medium text-white tracking-tight bg-zinc-950 w-full h-full rounded-full pr-8 pl-8 relative shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <span className="relative z-10">View Documentation</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-zinc-400 group-hover:text-indigo-200 transition-colors">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>


      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-[5] pointer-events-none"></div>
      <ScrollDemo />
    </section>
  );
};

export default Hero;
