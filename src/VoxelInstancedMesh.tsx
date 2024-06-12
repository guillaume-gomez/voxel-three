import { useRef , useEffect } from 'react';
import { Object3D, InstancedMesh, MeshLambertMaterial,Vector3,DoubleSide } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';


interface VoxelInstancedMeshProps {
  voxelsData: Vector3[];
}

const SIZE = 0.2;
const boxGeometry = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 2, 0.03);


const paramsMaterial = { roughness: 0.0, metalness: 0.2, emissive: 0x000000, castShadow: true};
const material =  new MeshLambertMaterial({color: "#BD2827", ...paramsMaterial})

function VoxelInstancedMesh ({voxelsData} : VoxelInstancedMeshProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    init();
  }, [voxelsData])

  function init() {
      voxelsData.map((position, index) => {
        const object = new Object3D();
        object.position.set(position.x, position.y, position.z);
        object.updateMatrix();
        meshRef.current?.setMatrixAt(index, object.matrix);
      })
    meshRef.current.instanceMatrix.needsUpdate = true;
  }

  return (
    <instancedMesh
      receiveShadow={true}
      castShadow={true}
      ref={meshRef}
      args={[boxGeometry, material, voxelsData.length ]}
    />
  );
}

export default VoxelInstancedMesh;