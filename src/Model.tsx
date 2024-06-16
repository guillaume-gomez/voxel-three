import { useEffect } from "react";
import { Vector3, Box3 } from "three";
import { Sky, useGLTF } from '@react-three/drei';

interface ModelProps {
  position: Vector3;
  rotation: Vector3;
  path?: string;
  modelSize?: number;
}

function Model({ position, rotation, path = '/Donut.glb', modelSize=8 }: ModelProps) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    const boundingBox = new Box3().setFromObject(scene);
    const size = boundingBox.getSize(new Vector3());
    const scaleFactor = modelSize / size.length();
    const center = boundingBox.getCenter(new Vector3()).multiplyScalar(-scaleFactor);

    scene.scale.multiplyScalar(scaleFactor);
  }, [scene]);

  return (
    <primitive
      position={position}
      rotation={rotation}
      object={scene}
    />
  );
}

export default Model;