/**
 * COMMANDO BATCH - 3D REALISTIC DEFENSE INSIGNIA (THREE.JS)
 * Realistic metallic commando badge with dynamic lighting & mouse perspective tilt
 */

(function () {
  let scene, camera, renderer, badgeGroup;
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;

  function initThreeBadge() {
    const container = document.getElementById('threeCanvasContainer');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8.5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Defense Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Warm Gold Key Light
    const keyLight = new THREE.DirectionalLight(0xfbbf24, 2.5);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);

    // Tactical Green Rim Light (representing paramilitary/cammo honor)
    const rimLightGreen = new THREE.DirectionalLight(0x10b981, 1.8);
    rimLightGreen.position.set(-6, -4, 4);
    scene.add(rimLightGreen);

    // White Top Specular
    const topLight = new THREE.PointLight(0xffffff, 2, 20);
    topLight.position.set(0, 6, 4);
    scene.add(topLight);

    // Create 3D Badge Group
    badgeGroup = new THREE.Group();

    // Metallic Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x241802
    });

    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.92,
      roughness: 0.35
    });

    const emeraldMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0x064e3b,
      emissiveIntensity: 0.3
    });

    const rubyMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.5,
      roughness: 0.25,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.4
    });

    // 1. Outer Octagonal / Shield Plate
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 2.8);
    shieldShape.lineTo(2.2, 1.6);
    shieldShape.lineTo(2.2, -1.0);
    shieldShape.lineTo(0, -2.8);
    shieldShape.lineTo(-2.2, -1.0);
    shieldShape.lineTo(-2.2, 1.6);
    shieldShape.closePath();

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.12
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();
    const shieldMesh = new THREE.Mesh(shieldGeo, darkMetalMaterial);
    badgeGroup.add(shieldMesh);

    // 2. Golden Embossed Inner Border
    const innerShieldShape = new THREE.Shape();
    innerShieldShape.moveTo(0, 2.5);
    innerShieldShape.lineTo(1.9, 1.4);
    innerShieldShape.lineTo(1.9, -0.8);
    innerShieldShape.lineTo(0, -2.4);
    innerShieldShape.lineTo(-1.9, -0.8);
    innerShieldShape.lineTo(-1.9, 1.4);
    innerShieldShape.closePath();

    const innerGeo = new THREE.ExtrudeGeometry(innerShieldShape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.08,
      bevelThickness: 0.08
    });
    innerGeo.center();
    const innerMesh = new THREE.Mesh(innerGeo, goldMaterial);
    badgeGroup.add(innerMesh);

    // 3. Central Emerald Medal Plaque
    const centerGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.48, 32);
    centerGeo.rotateX(Math.PI / 2);
    const centerMesh = new THREE.Mesh(centerGeo, emeraldMaterial);
    badgeGroup.add(centerMesh);

    // 4. Five-Pointed Defense Star
    const starShape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1.05;
    const innerRadius = 0.45;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    starGeo.center();
    const starMesh = new THREE.Mesh(starGeo, goldMaterial);
    starMesh.position.z = 0.32;
    badgeGroup.add(starMesh);

    // 5. Central Ruby Stud
    const rubyGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const rubyMesh = new THREE.Mesh(rubyGeo, rubyMaterial);
    rubyMesh.position.z = 0.52;
    badgeGroup.add(rubyMesh);

    // 6. Crossed Commando Daggers / Rifles behind
    const daggerGeo = new THREE.CylinderGeometry(0.06, 0.08, 5.2, 12);
    const dagger1 = new THREE.Mesh(daggerGeo, goldMaterial);
    dagger1.rotation.z = Math.PI / 4;
    dagger1.position.z = -0.3;

    const dagger2 = new THREE.Mesh(daggerGeo, goldMaterial);
    dagger2.rotation.z = -Math.PI / 4;
    dagger2.position.z = -0.3;

    badgeGroup.add(dagger1);
    badgeGroup.add(dagger2);

    // 7. Tactical Rivets on border
    const rivetGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const rivetPositions = [
      [0, 2.3], [1.7, 1.25], [1.7, -0.7], [0, -2.2], [-1.7, -0.7], [-1.7, 1.25]
    ];

    rivetPositions.forEach(pos => {
      const rivet = new THREE.Mesh(rivetGeo, goldMaterial);
      rivet.position.set(pos[0], pos[1], 0.25);
      badgeGroup.add(rivet);
    });

    scene.add(badgeGroup);

    // Mouse Interaction
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    animate();
  }

  function onMouseMove(event) {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    mouseX = (event.clientX - halfWidth) / halfWidth;
    mouseY = (event.clientY - halfHeight) / halfHeight;

    targetRotationY = mouseX * 0.45;
    targetRotationX = mouseY * 0.35;
  }

  function onWindowResize() {
    const container = document.getElementById('threeCanvasContainer');
    if (!container || !camera || !renderer) return;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  let clock = { getElapsedTime: () => Date.now() * 0.001 };

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (badgeGroup) {
      // Smooth interpolation to target mouse rotation
      badgeGroup.rotation.y += (targetRotationY - badgeGroup.rotation.y) * 0.05;
      badgeGroup.rotation.x += (targetRotationX - badgeGroup.rotation.x) * 0.05;

      // Gentle floating animation
      badgeGroup.position.y = Math.sin(time * 1.5) * 0.12;

      // Gentle idle spin accent
      badgeGroup.rotation.z = Math.sin(time * 0.8) * 0.03;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Export
  window.initThreeBadge = initThreeBadge;
})();
