import { useRef , useEffect } from 'react';
import {
    Object3D,
    InstancedMesh,
    MeshLambertMaterial,
    Vector3,
    Color,
    BufferGeometry,
    Material
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export interface VoxelData {
  color: Color;
  position: Vector3;
}

interface VoxelInstancedMeshProps {
  voxelsData: VoxelData[];
  geometryInstance?: BufferGeometry;
  materialInstance?: Material;
}

const SIZE = 0.2;
const boxGeometry = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 2, 0.03);
const material =  new MeshLambertMaterial({ emissive: 0x000000 })

function VoxelInstancedMesh ({voxelsData, geometryInstance = boxGeometry, materialInstance = material} : VoxelInstancedMeshProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    init();
  }, [voxelsData])

  function init() {
    voxelsData.map(({position, color}, index) => {
      const object = new Object3D();
      object.position.set(...position);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, color);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }

  return (
    <instancedMesh
      receiveShadow={true}
      castShadow={true}
      ref={meshRef}
      args={[geometryInstance, materialInstance, voxelsData.length ]}
    />
  );
}

export default VoxelInstancedMesh;