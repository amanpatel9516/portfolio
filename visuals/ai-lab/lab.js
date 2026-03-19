/* ═══════════════════════════════════════════════════════════
   LAB.JS — Universal Shape Composition (Phase 9)
   ═══════════════════════════════════════════════════════════ */

(function () {
  const container = document.getElementById('ai-lab-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  camera.position.z = 24; 

  scene.add(new THREE.AmbientLight(0x404040, 6));
  const pLight = new THREE.PointLight(0xffffff, 3, 100);
  pLight.position.set(15, 15, 15);
  scene.add(pLight);

  const PARTICLE_COUNT = 1500; // Extreme density for composite shapes
  const particles = [];
  const geom = new THREE.SphereGeometry(0.06, 6, 6);
  const pointsGroup = new THREE.Group();
  scene.add(pointsGroup);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: 0x00A3FF, shininess: 120 }));
    p.position.set((Math.random()-0.5)*25,(Math.random()-0.5)*25,(Math.random()-0.5)*25);
    p.userData.targetPos = p.position.clone();
    p.userData.originPos = p.position.clone();
    p.userData.burstPos = p.position.clone();
    p.userData.phase = Math.random() * Math.PI * 2;
    p.userData.initColor = p.material.color.clone();
    pointsGroup.add(p);
    particles.push(p);
  }

  // ─── Composite Typography & Shape Engine ───
  const textCanvas = document.createElement('canvas');
  const textCtx = textCanvas.getContext('2d');
  textCanvas.width = 1000;
  textCanvas.height = 1000; // Square for better shape distribution

  function drawHeart(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.moveTo(x, y + h / 4);
    ctx.quadraticCurveTo(x, y, x + w / 4, y);
    ctx.quadraticCurveTo(x + w / 2, y, x + w / 2, y + h / 4);
    ctx.quadraticCurveTo(x + w / 2, y, x + w * 3/4, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + h / 4);
    ctx.quadraticCurveTo(x + w, y + h / 2, x + w * 5/8, y + h * 3/4);
    ctx.lineTo(x + w / 2, y + h);
    ctx.lineTo(x + w * 3/8, y + h * 3/4);
    ctx.quadraticCurveTo(x, y + h / 2, x, y + h / 4);
    ctx.fill();
  }

  function getCompositePoints(text, useHeart = false) {
    textCtx.clearRect(0,0,1000,1000);
    textCtx.fillStyle = '#fff';
    
    if (useHeart) {
      textCtx.globalAlpha = 0.4;
      drawHeart(textCtx, 100, 100, 800, 800);
      textCtx.globalAlpha = 1.0;
      const fontSize = Math.min(100, 700 / (text.length * 0.7));
      textCtx.font = `bold ${fontSize}px "JetBrains Mono", sans-serif`;
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillText(text.toUpperCase(), 500, 500);
    } else {
      const fontSize = Math.min(150, 900 / (text.length * 0.7));
      textCtx.font = `bold ${fontSize}px "JetBrains Mono", sans-serif`;
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillText(text.toUpperCase(), 500, 500);
    }

    const data = textCtx.getImageData(0,0,1000,1000).data;
    const activePixels = [];
    for(let y=0; y<1000; y += 4) {
      for(let x=0; x<1000; x += 4) {
        if(data[((y*1000)+x)*4+3] > 80) {
          activePixels.push({x: (x-500)*0.03, y: (500-y)*0.03});
        }
      }
    }

    const pts = [];
    for(let i=0; i<PARTICLE_COUNT; i++) {
      const pix = activePixels[Math.floor(i * (activePixels.length / PARTICLE_COUNT))] || {x:0, y:0};
      pts.push(new THREE.Vector3(pix.x, pix.y, (Math.random()-0.5)*2));
    }
    return pts;
  }

  // ─── Interaction ───
  let lerpFactor = 1;
  const input = document.getElementById('lab-input');
  const terminal = document.getElementById('lab-terminal-output');
  const statusText = document.getElementById('lab-status-text');
  const btn = document.getElementById('lab-send-btn');
  const gauge = document.getElementById('sentiment-gauge');

  function showMsg(text) {
    const line = document.createElement('div');
    line.innerHTML = `<span class="term-prompt">></span> ${text}`;
    terminal.prepend(line);
    if (terminal.children.length > 7) terminal.lastChild.remove();
  }

  function morphTo(shapePoints) {
    particles.forEach((p, i) => {
      p.userData.originPos.copy(p.position);
      p.userData.targetPos.copy(shapePoints[i % shapePoints.length]);
      const burstScale = 3 + Math.random() * 2;
      p.userData.burstPos.copy(p.position).multiplyScalar(burstScale).add(new THREE.Vector3(
        (Math.random()-0.5)*15, (Math.random()-0.5)*15, (Math.random()-0.5)*15
      ));
    });
    lerpFactor = 0;
  }

  function handleCommand() {
    const rawVal = input.value.trim();
    if (!rawVal) return;
    const val = rawVal.toLowerCase();

    let targetPoints;
    let isHeartComposite = val.includes('heart') && val.length > 5;
    let cleanText = rawVal.replace(/heart/gi, '').replace(/inside/gi, '').trim();

    if (isHeartComposite) {
      targetPoints = getCompositePoints(cleanText || "LOVE", true);
      showMsg(`Composite Analysis: Nesting '${cleanText}' within Symbol[HEART].`);
      statusText.textContent = "STATE: HEART_COMPOSITE";
      particles.forEach(p => p.material.color.setHex(0xFF0055));
    } else {
      targetPoints = getCompositePoints(rawVal, false);
      showMsg(`Mapping '${rawVal.toUpperCase()}' pathway...`);
      statusText.textContent = `STATE: ${rawVal.toUpperCase()} MODE`;
      particles.forEach(p => p.material.color.setHex(0x00FF99));
    }

    morphTo(targetPoints);
    if(gauge) gauge.style.width = "100%";
    pointsGroup.rotation.set(0,0,0);
    input.value = '';
  }

  if (btn) btn.addEventListener('click', handleCommand);
  if (input) input.addEventListener('keydown', (e) => e.key === 'Enter' && (e.preventDefault(), handleCommand()));

  // ─── Animation Loop ───
  const mouse = new THREE.Vector2();
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.offsetWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.offsetHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    if (lerpFactor < 1) {
      lerpFactor += 0.008; // Cinematic slow morph
      particles.forEach(p => {
        if (lerpFactor < 0.25) {
          p.position.lerpVectors(p.userData.originPos, p.userData.burstPos, lerpFactor * 4);
        } else {
          const s = (lerpFactor - 0.25) * 1.33;
          const spiral = new THREE.Vector3(
            Math.sin(s*Math.PI*2 + p.userData.phase)*1,
            Math.cos(s*Math.PI*4 + p.userData.phase)*1,
            Math.sin(s*Math.PI*2)*0.5
          );
          p.position.lerpVectors(p.userData.burstPos, p.userData.targetPos, s).add(spiral.multiplyScalar(1-s));
        }
      });
    }

    pointsGroup.rotation.y += 0.001 + mouse.x * 0.002;
    pointsGroup.rotation.x += 0.0005 + mouse.y * 0.002;
    
    particles.forEach(p => { 
      const s = 1 + Math.sin(time*2 + p.userData.phase) * 0.2; 
      p.scale.set(s, s, s);
      // Magic shimmer cycle
      if (lerpFactor >= 1) {
        p.material.opacity = 0.7 + Math.sin(time*3 + p.userData.phase)*0.3;
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight; camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });
})();
