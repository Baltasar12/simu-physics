"use client";

import { Component, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import {
  CanvasTexture,
  Color,
  InstancedMesh,
  Object3D,
  Quaternion,
  Vector3 as ThreeVector,
} from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import type {
  CoilPairInputs,
  FieldSample,
  UniformRegion,
} from "@/types/helmholtz";
import type { Vector3 } from "@/types/magnetism";
import { clampProbe } from "@/physics/helmholtz";

interface Props {
  inputs: CoilPairInputs;
  field: FieldSample[];
  region: UniformRegion;
  probe: Vector3;
  onProbeMove: (p: Vector3) => void;
  showField: boolean;
  showUniform: boolean;
  showProbe: boolean;
  dragProbe: boolean;
  resetView: number;
}

function Label({
  position,
  text,
}: {
  position: [number, number, number];
  text: string;
}) {
  const label = useMemo(() => {
    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d")!;
    const lines = text.split("\n");
    ctx.font = '26px "Segoe UI", sans-serif';
    canvas.width =
      Math.ceil(Math.max(...lines.map((line) => ctx.measureText(line).width))) +
      24;
    canvas.height = lines.length * 34 + 16;
    ctx.fillStyle = "rgba(13,33,56,0.82)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '26px "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.fillStyle = "#e7f2ff";
    lines.forEach((line, i) =>
      ctx.fillText(line, canvas.width / 2, 30 + i * 34),
    );
    return {
      texture: new CanvasTexture(canvas),
      width: canvas.width / 300,
      height: canvas.height / 300,
    };
  }, [text]);
  useEffect(() => () => label.texture.dispose(), [label]);
  return (
    <sprite position={position} scale={[label.width, label.height, 1]}>
      <spriteMaterial map={label.texture} transparent depthTest={false} />
    </sprite>
  );
}

function FieldArrows({
  samples,
  scale,
  radius,
}: {
  samples: FieldSample[];
  scale: number;
  radius: number;
}) {
  const shafts = useRef<InstancedMesh>(null),
    heads = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const n = samples.length;
  useEffect(() => {
    if (!shafts.current || !heads.current) return;
    const object = new Object3D(),
      direction = new ThreeVector(),
      up = new ThreeVector(0, 1, 0);
    const sorted = samples.map((s) => s.magnitude).sort((a, b) => a - b);
    // Percentil 90: evita que un punto intenso junto al filamento comprima los colores.
    const reference = sorted[Math.floor(sorted.length * 0.9)] || 1;
    const length = radius * scale * 0.24;
    samples.forEach((s, i) => {
      direction.set(s.field.x, s.field.y, s.field.z).normalize();
      object.quaternion.setFromUnitVectors(up, direction);
      const start = new ThreeVector(
        s.point.x * scale,
        s.point.y * scale,
        s.point.z * scale,
      );
      object.position.copy(start).addScaledVector(direction, length * 0.32);
      object.scale.set(
        radius * scale * 0.008,
        length * 0.64,
        radius * scale * 0.008,
      );
      object.updateMatrix();
      shafts.current!.setMatrixAt(i, object.matrix);
      object.position.copy(start).addScaledVector(direction, length * 0.82);
      object.scale.set(
        radius * scale * 0.03,
        length * 0.36,
        radius * scale * 0.03,
      );
      object.updateMatrix();
      heads.current!.setMatrixAt(i, object.matrix);
      const t = Math.min(
        1,
        Math.log1p((s.magnitude / reference) * 9) / Math.log(10),
      );
      const color = new Color("#357cbb").lerp(new Color("#91fff3"), t);
      shafts.current!.setColorAt(i, color);
      heads.current!.setColorAt(i, color);
    });
    for (const mesh of [shafts.current, heads.current]) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
    invalidate();
  }, [samples, scale, radius, invalidate]);
  if (n === 0) return null;
  return (
    <group>
      <instancedMesh
        key={`shaft-${n}`}
        ref={shafts}
        args={[undefined, undefined, n]}
      >
        <cylinderGeometry args={[1, 1, 1, 5]} />
        <meshBasicMaterial transparent opacity={0.62} depthWrite={false} />
      </instancedMesh>
      <instancedMesh
        key={`head-${n}`}
        ref={heads}
        args={[undefined, undefined, n]}
      >
        <coneGeometry args={[1, 1, 6]} />
        <meshBasicMaterial transparent opacity={0.8} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

function UniformCloud({
  region,
  scale,
}: {
  region: UniformRegion;
  scale: number;
}) {
  const positions = useMemo(
    () =>
      Float32Array.from(
        region.points.flatMap((p) => [p.x * scale, p.y * scale, p.z * scale]),
      ),
    [region, scale],
  );
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#57efac"
        size={region.spacing * scale * 0.62}
        transparent
        opacity={0.48}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Coil({
  x,
  radius,
  turns,
  current,
  direction,
  index,
}: {
  x: number;
  radius: number;
  turns: number;
  current: number;
  direction: 1 | -1;
  index: number;
}) {
  const color = index === 1 ? "#ffbf69" : "#fa8a7f";
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius, radius * 0.035, 12, 96]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.35} />
      </mesh>
      {current > 0
        ? [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((phi) => {
            const tangent = new ThreeVector(
              0,
              -Math.sin(phi) * direction,
              Math.cos(phi) * direction,
            );
            const q = new Quaternion().setFromUnitVectors(
              new ThreeVector(0, 1, 0),
              tangent,
            );
            return (
              <mesh
                key={phi}
                position={[0, radius * Math.cos(phi), radius * Math.sin(phi)]}
                quaternion={q}
              >
                <coneGeometry args={[radius * 0.065, radius * 0.18, 10]} />
                <meshBasicMaterial color="#fff7e9" />
              </mesh>
            );
          })
        : null}
      <Label
        position={[0, -radius * 1.22, 0]}
        text={`Bobina ${index} · N=${turns}\n${current} A · ${direction === 1 ? "↺ Antihoraria" : "↻ Horaria"}`}
      />
    </group>
  );
}

function SceneContent({
  inputs: p,
  field,
  region,
  probe,
  onProbeMove,
  showField,
  showUniform,
  showProbe,
  dragProbe,
  resetView,
}: Props) {
  const unit = Math.max(p.radius, p.separation / 2),
    scale = 1 / unit,
    radius = p.radius * scale;
  const probeMesh = useRef<Object3D>(null);
  const orbit = useRef<OrbitControlsType>(null);
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(3.25, 2.15, 3.6);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    if (orbit.current) {
      orbit.current.target.set(0, 0, 0);
      orbit.current.update();
    }
    invalidate();
  }, [resetView, camera, invalidate]);
  const extent = (p.separation / 2) * scale + radius * 1.5;
  const move = () => {
    if (!probeMesh.current) return;
    const v = probeMesh.current.position;
    const next = clampProbe(
      { x: v.x / scale, y: v.y / scale, z: v.z / scale },
      p,
    );
    probeMesh.current.position.set(
      next.x * scale,
      next.y * scale,
      next.z * scale,
    );
    onProbeMove(next);
  };
  return (
    <>
      <color attach="background" args={["#0d2138"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 4]} intensity={3} />
      <gridHelper
        args={[6, 24, "#35506a", "#1b334b"]}
        position={[0, -1.6, 0]}
      />
      <axesHelper args={[1.55]} />
      <Label position={[1.7, 0, 0]} text="+X" />
      <Label position={[0, 1.7, 0]} text="+Y" />
      <Label position={[0, 0, 1.7]} text="+Z" />
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.003, 0.003, extent * 2, 6]} />
        <meshBasicMaterial color="#92b0c9" transparent opacity={0.5} />
      </mesh>
      <Coil
        x={(-p.separation / 2) * scale}
        radius={radius}
        turns={p.turns1}
        current={p.current1}
        direction={p.direction1}
        index={1}
      />
      <Coil
        x={(p.separation / 2) * scale}
        radius={radius}
        turns={p.turns2}
        current={p.current2}
        direction={p.direction2}
        index={2}
      />
      {showField ? (
        <FieldArrows samples={field} scale={scale} radius={p.radius} />
      ) : null}
      {showUniform && region.reference !== null ? (
        <UniformCloud region={region} scale={scale} />
      ) : null}
      <OrbitControls
        ref={orbit}
        makeDefault
        minDistance={1}
        maxDistance={12}
        enableDamping={false}
      />
      {showProbe ? (
        <>
          <mesh
            ref={probeMesh}
            position={[probe.x * scale, probe.y * scale, probe.z * scale]}
          >
            <sphereGeometry args={[0.055, 20, 16]} />
            <meshStandardMaterial
              color="white"
              emissive="#286779"
              emissiveIntensity={0.5}
            />
          </mesh>
          {dragProbe ? (
            <TransformControls
              object={probeMesh as React.RefObject<Object3D>}
              mode="translate"
              size={0.65}
              onObjectChange={move}
            />
          ) : null}
          <Label
            position={[
              probe.x * scale,
              probe.y * scale + 0.13,
              probe.z * scale,
            ]}
            text="Sonda"
          />
        </>
      ) : null}
    </>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="helm-canvas-fallback">
        No se pudo iniciar la escena WebGL. Probá un navegador con aceleración
        gráfica. Los controles, la sonda numérica y el gráfico siguen
        disponibles.
      </div>
    ) : (
      this.props.children
    );
  }
}

export default function HelmholtzScene(props: Props) {
  return (
    <SceneBoundary>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ position: [3.25, 2.15, 3.6], fov: 43, near: 0.01, far: 100 }}
        fallback={
          <div className="helm-canvas-fallback">
            WebGL no está disponible. Usá los controles numéricos y el gráfico.
          </div>
        }
      >
        <SceneContent {...props} />
      </Canvas>
    </SceneBoundary>
  );
}
