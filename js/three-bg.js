/* ═══════════════════════════════════════════════════════════
   THREE-BG.JS — Three.js interactive particle constellation
   ═══════════════════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ─── Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 5;

  // ─── Particles
  const PARTICLE_COUNT = 180;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  // Amber/gold/orange color palette for particles
  const colorPalette = [
    { r: 0.91, g: 0.63, b: 0.13 },  // #E8A020 amber
    { r: 0.83, g: 0.38, b: 0.10 },  // #D4601A burnt orange
    { r: 0.94, g: 0.69, b: 0.25 },  // #F0B040 gold
    { r: 0.78, g: 0.53, b: 0.10 },  // warm dark gold
    { r: 0.95, g: 0.85, b: 0.70 },  // warm white
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 14;
    positions[i3 + 1] = (Math.random() - 0.5) * 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 8;

    velocities.push({
      x: (Math.random() - 0.5) * 0.003,
      y: (Math.random() - 0.5) * 0.003,
      z: (Math.random() - 0.5) * 0.002
    });

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ─── Connection lines
  const lineGeometry = new THREE.BufferGeometry();
  const MAX_LINES = 300;
  const linePositions = new Float32Array(MAX_LINES * 6);
  const lineColors = new Float32Array(MAX_LINES * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.15,
    linewidth: 1
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // ─── Mouse interaction
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ─── Animate
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse follow
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Move particles
    const posArray = geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i].x;
      posArray[i3 + 1] += velocities[i].y;
      posArray[i3 + 2] += velocities[i].z;

      // Boundary wrapping
      if (Math.abs(posArray[i3]) > 7) velocities[i].x *= -1;
      if (Math.abs(posArray[i3 + 1]) > 5) velocities[i].y *= -1;
      if (Math.abs(posArray[i3 + 2]) > 4) velocities[i].z *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    // Update connection lines
    let lineIndex = 0;
    const CONNECTION_DIST = 2.2;

    for (let i = 0; i < PARTICLE_COUNT && lineIndex < MAX_LINES; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT && lineIndex < MAX_LINES; j++) {
        const i3 = i * 3;
        const j3 = j * 3;
        const dx = posArray[i3] - posArray[j3];
        const dy = posArray[i3 + 1] - posArray[j3 + 1];
        const dz = posArray[i3 + 2] - posArray[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DIST) {
          const li = lineIndex * 6;
          linePositions[li] = posArray[i3];
          linePositions[li + 1] = posArray[i3 + 1];
          linePositions[li + 2] = posArray[i3 + 2];
          linePositions[li + 3] = posArray[j3];
          linePositions[li + 4] = posArray[j3 + 1];
          linePositions[li + 5] = posArray[j3 + 2];

          const alpha = 1 - dist / CONNECTION_DIST;
          lineColors[li] = 0.91 * alpha;
          lineColors[li + 1] = 0.63 * alpha;
          lineColors[li + 2] = 0.13 * alpha;
          lineColors[li + 3] = 0.91 * alpha;
          lineColors[li + 4] = 0.63 * alpha;
          lineColors[li + 5] = 0.13 * alpha;

          lineIndex++;
        }
      }
    }

    // Clear remaining lines
    for (let i = lineIndex * 6; i < MAX_LINES * 6; i++) {
      linePositions[i] = 0;
      lineColors[i] = 0;
    }

    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    // Mouse-reactive rotation
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    particles.rotation.y += mouse.x * 0.003;
    particles.rotation.x += mouse.y * 0.002;

    lines.rotation.copy(particles.rotation);

    renderer.render(scene, camera);
  }

  animate();

  // ─── Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();
