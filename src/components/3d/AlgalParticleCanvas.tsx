import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlePointsProps {
  count?: number;
}

function ParticlePoints({ count = 1500 }: ParticlePointsProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate 3D coordinates and subtle size/color variations for microalgae suspension
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const emeraldColor = new THREE.Color('#10b981');
    const cyanColor = new THREE.Color('#06b6d4');
    const limeColor = new THREE.Color('#84cc16');

    for (let i = 0; i < count; i++) {
      // Cylindrical / toroidal cloud resembling a photobioreactor flow
      const radius = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 8;

      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = radius * Math.sin(theta);

      // Color variation between emerald, cyan, and lime
      const pColor = Math.random() > 0.6 ? emeraldColor : (Math.random() > 0.5 ? cyanColor : limeColor);
      col[i * 3] = pColor.r;
      col[i * 3 + 1] = pColor.g;
      col[i * 3 + 2] = pColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export const AlgalParticleCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-60">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <ParticlePoints count={1200} />
      </Canvas>
    </div>
  );
};
