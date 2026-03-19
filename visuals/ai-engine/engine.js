/* ═══════════════════════════════════════════════════════════
   ENGINE.JS — Global AI Neural Engine (3D Three.js)
   ═══════════════════════════════════════════════════════════ */

(function () {
  const container = document.getElementById('ai-engine-container');
  if (!container || typeof THREE === 'undefined') return;

  // ─── Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  camera.position.z = 12;

  // ─── Constants
  const NODE_COUNT = 30;
  const DATA_PULSE_COUNT = 15;
  const ACCENT_COLOR = 0xE8A020; // Amber

  // ─── Node Creation
  const nodes = [];
  const nodeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: ACCENT_COLOR });

  for (let i = 0; i < NODE_COUNT; i++) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5
    );
    // Floating movement data
    node.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.005
    );
    scene.add(node);
    nodes.push(node);
  }

  // ─── Neural Connections (Lines)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: ACCENT_COLOR,
    transparent: true,
    opacity: 0.15
  });

  const connections = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const nearNodes = nodes
      .map((n, idx) => ({ node: n, dist: nodes[i].position.distanceTo(n.position), idx }))
      .sort((a, b) => a.dist - b.dist)
      .slice(1, 4); // Top 3 closest

    nearNodes.forEach(near => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        nodes[i].position,
        near.node.position
      ]);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
      connections.push({ line, start: nodes[i], end: near.node });
    });
  }

  // ─── Data Pulses (The "Magic")
  const pulses = [];
  const pulseGeometry = new THREE.SphereGeometry(0.04, 8, 8);
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

  for (let i = 0; i < DATA_PULSE_COUNT; i++) {
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    // Assign to a random connection
    const conn = connections[Math.floor(Math.random() * connections.length)];
    pulse.userData.connection = conn;
    pulse.userData.progress = Math.random();
    scene.add(pulse);
    pulses.push(pulse);
  }

  // ─── Mouse Interaction
  const mouse = { x: 0, y: 0 };
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.offsetWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.offsetHeight) * 2 + 1;
  });

  // ─── Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Update Nodes
    nodes.forEach(node => {
      node.position.add(node.userData.velocity);
      // Bound check
      if (Math.abs(node.position.x) > 8) node.userData.velocity.x *= -1;
      if (Math.abs(node.position.y) > 5) node.userData.velocity.y *= -1;
    });

    // Update Pulses & Lines
    pulses.forEach(pulse => {
      pulse.userData.progress += 0.01;
      if (pulse.userData.progress > 1) {
        pulse.userData.progress = 0;
        // Switch to a random connection for more variety
        pulse.userData.connection = connections[Math.floor(Math.random() * connections.length)];
      }

      const { start, end } = pulse.userData.connection;
      pulse.position.lerpVectors(start.position, end.position, pulse.userData.progress);
    });

    connections.forEach(conn => {
      const pos = conn.line.geometry.attributes.position.array;
      pos[0] = conn.start.position.x;
      pos[1] = conn.start.position.y;
      pos[2] = conn.start.position.z;
      pos[3] = conn.end.position.x;
      pos[4] = conn.end.position.y;
      pos[5] = conn.end.position.z;
      conn.line.geometry.attributes.position.needsUpdate = true;
    });

    // Scene Rotation based on mouse
    scene.rotation.y += (mouse.x * 0.2 - scene.rotation.y) * 0.05;
    scene.rotation.x += (mouse.y * 0.1 - scene.rotation.x) * 0.05;

    // Pulse colors
    pulseMaterial.opacity = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;

    renderer.render(scene, camera);
  }

  animate();

  // ─── Handle Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });
})();
