import { useEffect, useState } from "react";
import { Vector3, Box3 } from "three";
import { Sky, useGLTF } from '@react-three/drei';

interface ModelProps {
  position: Vector3;
  rotation: Vector3;
  scale?: Vector3;
  path?: string;
  autoScale?: boolean;
}

const MAX_SIZE = 8;
const SCALE = new Vector3(1,1,1);

function Model({ position, rotation, scale = SCALE, path = '/Donut.glb', autoScale=false }: ModelProps) {
  const { scene } = useGLTF(path);
  const [computedScale, setComputedScale] = useState<Vector3>(scale);

  useEffect(() => {
    if(autoScale && scene) {
      const boundingBox = new Box3().setFromObject(scene);
      const size = boundingBox.getSize(new Vector3());
      const scaleFactor = MAX_SIZE / size.length();

      scene.scale.multiplyScalar(scaleFactor);
      setComputedScale(new Vector3(scaleFactor, scaleFactor, scaleFactor));
    } else {
      scene.scale.set(...computedScale);
    }

  }, [autoScale, scene]);

  return (
    <primitive
      position={position}
      rotation={rotation}
      object={scene}
    />
  );
}

export default Model;