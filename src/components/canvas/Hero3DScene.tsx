import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF8F6F0, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Tailored for Ivory Marble & Metallic Gold)
    const ambientLight = new THREE.AmbientLight(0x4B6E4A, 1.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 3.2);
    sunLight.position.set(5, 8, 6);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const goldKeyLight = new THREE.DirectionalLight(0xC59B27, 2.2);
    goldKeyLight.position.set(-4, 3, 2);
    scene.add(goldKeyLight);

    const forestFillLight = new THREE.DirectionalLight(0x0F2E1E, 1.4);
    forestFillLight.position.set(0, -3, 3);
    scene.add(forestFillLight);

    // 3. Botanical Specimen Group
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);

    // Planter Pot in Obsidian Evergreen (#0A1C13)
    const potRadiusTop = 0.88;
    const potRadiusBottom = 0.68;
    const potHeight = 1.45;
    const potGeometry = new THREE.CylinderGeometry(potRadiusTop, potRadiusBottom, potHeight, 36);
    potGeometry.computeBoundingBox();
    potGeometry.computeBoundingSphere();
    const potMaterial = new THREE.MeshStandardMaterial({
      color: 0x0A1C13,
      roughness: 0.35,
      metalness: 0.25
    });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -1.6;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantGroup.add(pot);

    // Pot Metallic Gold Rim (#C59B27)
    const rimGeometry = new THREE.TorusGeometry(potRadiusTop + 0.01, 0.035, 16, 64);
    rimGeometry.computeBoundingBox();
    rimGeometry.computeBoundingSphere();
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xC59B27,
      metalness: 0.92,
      roughness: 0.18
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = -0.875;
    rim.rotation.x = Math.PI / 2;
    plantGroup.add(rim);

    // Rich Dark Potting Soil
    const soilGeometry = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 32);
    soilGeometry.computeBoundingBox();
    soilGeometry.computeBoundingSphere();
    const soilMaterial = new THREE.MeshStandardMaterial({
      color: 0x07150E,
      roughness: 0.95,
      metalness: 0.05
    });
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = -0.9;
    plantGroup.add(soil);

    // Procedural Organic Stems & Foliage
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x164C33,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    const highlightLeafMaterial = new THREE.MeshStandardMaterial({
      color: 0x2A7350,
      roughness: 0.28,
      metalness: 0.12,
      side: THREE.DoubleSide
    });

    const createLeafMesh = (scaleX = 1, scaleY = 1.5, isHighlight = false) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(scaleX * 0.8, scaleY * 0.3, scaleX * 0.9, scaleY * 0.7, 0, scaleY);
      shape.bezierCurveTo(-scaleX * 0.9, scaleY * 0.7, -scaleX * 0.8, scaleY * 0.3, 0, 0);

      const geometry = new THREE.ShapeGeometry(shape, 12);
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        const z = -Math.sin((y / scaleY) * Math.PI) * 0.25 + (Math.abs(x) * 0.1);
        pos.setZ(i, z);
      }
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      return new THREE.Mesh(geometry, isHighlight ? highlightLeafMaterial : leafMaterial);
    };

    // Main Stem
    const stemCurvePoints = [
      new THREE.Vector3(0, -0.9, 0),
      new THREE.Vector3(0.05, -0.2, 0.05),
      new THREE.Vector3(-0.08, 0.6, -0.05),
      new THREE.Vector3(0.02, 1.4, 0.02)
    ];
    const mainStemCurve = new THREE.CatmullRomCurve3(stemCurvePoints);
    const stemGeometry = new THREE.TubeGeometry(mainStemCurve, 20, 0.05, 12, false);
    stemGeometry.computeBoundingBox();
    stemGeometry.computeBoundingSphere();

    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x0F2E1E,
      roughness: 0.4
    });
    const mainStem = new THREE.Mesh(stemGeometry, stemMaterial);
    plantGroup.add(mainStem);

    // Leaves arrangement
    interface LeafNode {
      pos: THREE.Vector3;
      rot: THREE.Vector3;
      scale: [number, number];
      highlight?: boolean;
    }

    const leafNodes: LeafNode[] = [
      { pos: new THREE.Vector3(0.1, -0.4, 0.1), rot: new THREE.Vector3(0.8, 0.3, -0.5), scale: [0.7, 1.1] },
      { pos: new THREE.Vector3(-0.1, -0.1, -0.05), rot: new THREE.Vector3(0.6, -0.8, 0.6), scale: [0.8, 1.3] },
      { pos: new THREE.Vector3(0.15, 0.3, -0.1), rot: new THREE.Vector3(0.4, 1.1, -0.7), scale: [0.9, 1.4], highlight: true },
      { pos: new THREE.Vector3(-0.12, 0.65, 0.1), rot: new THREE.Vector3(-0.5, -0.4, 0.5), scale: [1.0, 1.6] },
      { pos: new THREE.Vector3(0.08, 0.95, 0.05), rot: new THREE.Vector3(0.3, 0.7, -0.4), scale: [1.1, 1.7], highlight: true },
      { pos: new THREE.Vector3(-0.05, 1.25, -0.05), rot: new THREE.Vector3(-0.4, -0.9, 0.3), scale: [0.9, 1.4] },
      { pos: new THREE.Vector3(0.02, 1.45, 0.02), rot: new THREE.Vector3(0.2, 0.1, -0.1), scale: [0.75, 1.2], highlight: true }
    ];

    const leafMeshes: THREE.Mesh[] = [];
    leafNodes.forEach((node) => {
      const leaf = createLeafMesh(node.scale[0], node.scale[1], node.highlight);
      leaf.position.copy(node.pos);
      leaf.rotation.set(node.rot.x, node.rot.y, node.rot.z);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      plantGroup.add(leaf);
      leafMeshes.push(leaf);
    });

    // 4. Ambient Bio-Spore Particle System (#C59B27 Gold & #4B6E4A Green)
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.computeBoundingBox();
    particleGeo.computeBoundingSphere();

    // Golden pollen droplet texture
    const canvasSpore = document.createElement('canvas');
    canvasSpore.width = 64;
    canvasSpore.height = 64;
    const ctxSpore = canvasSpore.getContext('2d');
    if (ctxSpore) {
      const gradient = ctxSpore.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(197, 155, 39, 1)');
      gradient.addColorStop(0.35, 'rgba(223, 184, 71, 0.85)');
      gradient.addColorStop(0.7, 'rgba(75, 110, 74, 0.3)');
      gradient.addColorStop(1, 'rgba(248, 246, 240, 0)');
      ctxSpore.fillStyle = gradient;
      ctxSpore.fillRect(0, 0, 64, 64);
    }
    const sporeTexture = new THREE.CanvasTexture(canvasSpore);

    const particleMat = new THREE.PointsMaterial({
      size: 0.11,
      map: sporeTexture,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Interactive Mouse Parallax & Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let isVisible = true;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX;
      mouseY = normY;
      targetRotationY = normX * 0.6;
      targetRotationX = -normY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth || window.innerWidth;
      const newH = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause loop when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Saves GPU cycles when scrolled away

      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia damping for plant rotation
      plantGroup.rotation.y += (targetRotationY - plantGroup.rotation.y) * 0.04;
      plantGroup.rotation.x += (targetRotationX - plantGroup.rotation.x) * 0.04;

      // Gentle organic idle breathing
      plantGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.07 - 0.18;

      // Subtle organic leaf sway
      leafMeshes.forEach((leaf, idx) => {
        const offset = idx * 0.45;
        leaf.rotation.z += Math.sin(elapsedTime * 1.5 + offset) * 0.0012;
        leaf.rotation.x += Math.cos(elapsedTime * 1.2 + offset) * 0.0012;
      });

      // Bio-particles gentle upward drift
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += 0.0025;
        posArr[i * 3] += Math.sin(elapsedTime * 0.5 + i) * 0.0018;
        if (posArr[i * 3 + 1] > 4) {
          posArr[i * 3 + 1] = -4;
        }
      }
      posAttr.needsUpdate = true;

      particles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Teardown
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sporeTexture.dispose();
      particleGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
};
