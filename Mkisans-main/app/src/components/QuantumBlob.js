import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as THREE from 'three';

export default function QuantumBlob({ audioEnergy = 0, size = 200 }) {
  const containerRef = useRef(null);
  const audioRef = useRef(audioEnergy);
  
  useEffect(() => {
    audioRef.current = audioEnergy;
  }, [audioEnergy]);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer, scene, camera, clock, frameId;
    let nodes, starField;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
      camera.position.set(0, 0, 32);
      
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.background = 'none';
      containerRef.current.appendChild(renderer.domElement);

      // --- STARFIELD ---
      const starGeo = new THREE.BufferGeometry();
      const starPos = [];
      for (let i = 0; i < 500; i++) {
        const r = 25 + Math.random() * 10;
        const phi = Math.acos(-1 + 2 * Math.random());
        const theta = Math.random() * Math.PI * 2;
        starPos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      }
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
      starField = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x4488ff, size: 0.1, transparent: true, opacity: 0.5 }));
      scene.add(starField);

      // --- LIQUID NOISE SHADER (Restoring your logic) ---
      const uniforms = {
        uTime: { value: 0 },
        uAudio: { value: 0 }
      };

      const nodeMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
          varying vec3 vColor;
          varying float vGlow;
          uniform float uTime;
          uniform float uAudio;
          
          // Simplex 3D Noise 
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }

          void main() {
            vColor = vec3(0.3, 0.6, 1.0);
            vec3 pos = position;
            float noise = snoise(pos * 0.1 + uTime * 0.5);
            pos += normal * noise * (2.0 + uAudio * 12.0);
            vGlow = noise * 0.5 + 0.5;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (12.0 + uAudio * 35.0) * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vGlow;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            
            // FAKE BLOOM LOGIC: 
            // We create an exponential glow falloff directly in the shader
            float strength = pow(1.0 - (d * 2.0), 2.5);
            vec3 glowColor = vColor + vec3(vGlow * 0.2);
            
            // Bright white core, soft blue aura
            gl_FragColor = vec4(glowColor + vec3(strength * 0.4), strength);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const nodeGeom = new THREE.IcosahedronGeometry(12, 3);
      nodes = new THREE.Points(nodeGeom, nodeMat);
      scene.add(nodes);

      const lineMat = new THREE.LineBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.3 });
      const lines = new THREE.LineSegments(new THREE.WireframeGeometry(nodeGeom), lineMat);
      scene.add(lines);

      clock = new THREE.Clock();
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;
        uniforms.uAudio.value = audioRef.current;
        nodes.rotation.y = t * 0.1;
        starField.rotation.y = t * 0.05;
        lines.rotation.y = t * 0.1;
        
        const s = 1.0 + audioRef.current * 0.3;
        nodes.scale.set(s,s,s);
        lines.scale.set(s,s,s);
        
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(frameId);
        renderer.dispose();
      };
    } catch (e) {
      console.error(e);
    }
  }, [size]);

  return <View ref={containerRef} style={[styles.container, { width: size, height: size }]} />;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});
