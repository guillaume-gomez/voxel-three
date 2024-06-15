import { Vector3 } from "three";
import { Sky, useGLTF } from '@react-three/drei';

interface ModelProps {
  path: string;
  position: Vector3;
  rotation: Vector3;
}

function Model({ position, rotation, path = '/Donut.glb' }: ModelProps) {
  const { scene } = useGLTF(path);

  return (
    <primitive
      position={position}
      rotation={rotation}
      object={scene}
    />
  );
}

export default Model;