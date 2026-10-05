import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Lớp nền Three.js phủ sau toàn bộ giao diện — lấy cảm hứng từ các mảng wireframe
 * và hạt sáng của ảnh tham chiếu: một khối đa diện lưới dây, một vòng xuyến mang
 * màu nhấn của màn hình hiện tại, một nút dây thắt và trường hạt "bụi mực".
 *
 * - Tôn trọng `prefers-reduced-motion`: chỉ vẽ một khung hình tĩnh.
 * - Màu vòng xuyến đổi theo prop `accent` (cam ↔ periwinkle).
 */
export function Backdrop({ accent = '#ff5a1f' }) {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const ink = 0x0d0d10;

    /* Khối đa diện lưới dây — góc phải, như mảng wireframe của poster */
    const poly = new THREE.Mesh(
      new THREE.IcosahedronGeometry(4.6, 1),
      new THREE.MeshBasicMaterial({ color: ink, wireframe: true, transparent: true, opacity: 0.13 }),
    );
    poly.position.set(6.8, 2.8, -2);

    /* Vòng xuyến mang màu nhấn — đổi màu theo màn hình */
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.9, 10, 42),
      new THREE.MeshBasicMaterial({ color: accentRef.current, wireframe: true, transparent: true, opacity: 0.3 }),
    );
    ring.position.set(-7.2, -2.6, -3);

    /* Nút dây — sóng âm trừu tượng giữa trang */
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.8, 0.45, 96, 12),
      new THREE.MeshBasicMaterial({ color: ink, wireframe: true, transparent: true, opacity: 0.09 }),
    );
    knot.position.set(0.6, -4.6, -5);

    /* Trường hạt bụi mực */
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 17;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dust = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: ink, size: 0.05, transparent: true, opacity: 0.45 }),
    );

    scene.add(poly, ring, knot, dust);

    const resize = () => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    apiRef.current = { setColor: (value) => ring.material.color.set(value) };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let px = 0; let py = 0; let tx = 0; let ty = 0;

    const onPointer = (event) => {
      tx = event.clientX / window.innerWidth - 0.5;
      ty = event.clientY / window.innerHeight - 0.5;
    };

    const tick = (time) => {
      resize();
      const s = time * 0.00012;
      poly.rotation.set(s, s * 1.3, 0);
      ring.rotation.set(s * 1.6, s, 0);
      knot.rotation.y = -s;
      dust.rotation.y = s * 0.2;
      px += (tx - px) * 0.04;
      py += (ty - py) * 0.04;
      camera.position.x = px * 1.5;
      camera.position.y = -py * 1.1;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(tick);
    };

    resize();
    if (reduced) {
      renderer.render(scene, camera); // một khung hình tĩnh
    } else {
      raf = window.requestAnimationFrame(tick);
      window.addEventListener('pointermove', onPointer);
    }
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      poly.geometry.dispose(); ring.geometry.dispose(); knot.geometry.dispose(); geometry.dispose();
      poly.material.dispose(); ring.material.dispose(); knot.material.dispose(); dust.material.dispose();
      renderer.dispose();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setColor(accent);
  }, [accent]);

  return <canvas ref={canvasRef} className="rr-three" aria-hidden="true" />;
}
