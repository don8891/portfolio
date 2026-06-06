/**
 * Three.js 3D Background — Deep Space Galaxy + Floating Network Nodes
 * Matches the dark space theme of Don Johns' portfolio.
 */

(function () {
  // ─── Scene Setup ────────────────────────────────────────────────────────────
  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  // ─── Star Field ─────────────────────────────────────────────────────────────
  const starCount = 4000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3]     = (Math.random() - 0.5) * 400;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    starSizes[i] = Math.random() * 1.5 + 0.3;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    sizeAttenuation: true,
    size: 0.35,
    transparent: true,
    opacity: 0.85,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // ─── Nebula Glow Cloud ───────────────────────────────────────────────────────
  const nebulaCount = 800;
  const nebulaGeo = new THREE.BufferGeometry();
  const nebulaPos = new Float32Array(nebulaCount * 3);
  const nebulaColors = new Float32Array(nebulaCount * 3);

  const crimson = new THREE.Color(0xFF3B30);
  const deepRose = new THREE.Color(0x2B0C16);
  const gold = new THREE.Color(0xFF9500);

  for (let i = 0; i < nebulaCount; i++) {
    const r = 60 + Math.random() * 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    nebulaPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    nebulaPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
    nebulaPos[i * 3 + 2] = r * Math.cos(phi);

    const mix = Math.random();
    const col = mix > 0.5 ? crimson.clone().lerp(gold, Math.random() * 0.5) : deepRose.clone().lerp(crimson, Math.random() * 0.4);
    nebulaColors[i * 3]     = col.r;
    nebulaColors[i * 3 + 1] = col.g;
    nebulaColors[i * 3 + 2] = col.b;
  }

  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
  nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

  const nebulaMat = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.18,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const nebula = new THREE.Points(nebulaGeo, nebulaMat);
  scene.add(nebula);

  // ─── Floating Network Nodes (Data Graph) ────────────────────────────────────
  const nodeCount = 55;
  const nodePositions = [];
  const nodeMeshes = [];

  const nodeGeo = new THREE.SphereGeometry(0.35, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xFF3B30, transparent: true, opacity: 0.9 });
  const smallNodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });

  for (let i = 0; i < nodeCount; i++) {
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 60 - 10
    );
    nodePositions.push(pos);

    const mat = Math.random() > 0.7 ? nodeMat.clone() : smallNodeMat.clone();
    const size = Math.random() > 0.7 ? 0.4 : 0.2;
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), mat);
    mesh.position.copy(pos);
    scene.add(mesh);
    nodeMeshes.push({ mesh, velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.005) });
  }

  // ─── Connection Lines between nearby nodes ──────────────────────────────────
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xFF3B30,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const lineObjects = [];

  function buildLines() {
    // Remove old lines
    lineObjects.forEach(l => scene.remove(l));
    lineObjects.length = 0;

    const maxDist = 28;
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDist) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
          const line = new THREE.Line(lineGeo, lineMat.clone());
          line.material.opacity = 0.1 * (1 - dist / maxDist);
          scene.add(line);
          lineObjects.push(line);
        }
      }
    }
  }

  buildLines();

  // ─── Mouse Parallax ─────────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ─── Resize Handler ─────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── Animation Loop ─────────────────────────────────────────────────────────
  let frame = 0;
  let lineRebuildCounter = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Smooth mouse parallax on camera
    targetX += (mouseX * 4 - targetX) * 0.04;
    targetY += (-mouseY * 3 - targetY) * 0.04;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    // Slowly rotate star field
    stars.rotation.y += 0.00012;
    stars.rotation.x += 0.00005;

    // Gently rotate nebula in opposite direction
    nebula.rotation.y -= 0.00008;
    nebula.rotation.z += 0.00005;

    // Animate nodes floating
    nodeMeshes.forEach(({ mesh, velocity }) => {
      mesh.position.x += velocity.x;
      mesh.position.y += velocity.y;
      mesh.position.z += velocity.z;

      // Bounce softly within bounds
      if (Math.abs(mesh.position.x) > 60) velocity.x *= -1;
      if (Math.abs(mesh.position.y) > 35) velocity.y *= -1;
      if (Math.abs(mesh.position.z) > 30) velocity.z *= -1;

      // Pulse opacity
      mesh.material.opacity = 0.5 + 0.4 * Math.sin(frame * 0.02 + mesh.position.x);
    });

    // Sync nodePositions with mesh positions for line rebuild
    nodeMeshes.forEach(({ mesh }, i) => {
      nodePositions[i].copy(mesh.position);
    });

    // Rebuild lines every 90 frames (1.5s @60fps) for performance
    lineRebuildCounter++;
    if (lineRebuildCounter >= 90) {
      buildLines();
      lineRebuildCounter = 0;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
