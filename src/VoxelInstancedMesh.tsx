import { useRef , useEffect } from 'react';
import { Object3D, InstancedMesh, MeshLambertMaterial,Vector3, Color  } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useSpring, useSpringRef, easings} from '@react-spring/web';

export interface VoxelData {
  color: Color;
  position: Vector3;
}

interface VoxelInstancedMeshProps {
  voxelsData: VoxelData[];
  blockSize: number;
}

const SIZE = 0.2;
//const boxGeometry = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 2, 0.03);
const material =  new MeshLambertMaterial({ emissive: 0x000000 })


const TRANSITION_DURATION = 2000; //ms
const DELAY_DURATION = 500; //ms


function VoxelInstancedMesh ({voxelsData, blockSize} : VoxelInstancedMeshProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const boxGeometry = new RoundedBoxGeometry(blockSize, blockSize, blockSize, 2, 0.03);

  const springApi = useSpringRef();
  const springs = useSpring({
      ref: springApi,
      from: { ratio: 0 },
      to: { ratio: 1 },
      delay: DELAY_DURATION,
      config: {
        duration: TRANSITION_DURATION,
        easing: easings.easeOutElastic
      },
      reset: true,
      onChange: ({value: {ratio}}) => {
        renderFramePosition(ratio)
      }
    },
  );

  useEffect(() => {
    init();
    springApi.stop();
    springApi.start();
  }, [voxelsData, springApi, blockSize]);

  //render once
  function renderOnce() {
    voxelsData.map(({position, color}, index) => {
      const object = new Object3D();
      object.position.set(position.x, position.y, position.z);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, color);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }

  function init() {
    voxelsData.map(({ color}, index) => {
      const object = new Object3D();
      object.position.set(0,0,0);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, color);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }

  function renderFramePosition(ratio: number) {
    voxelsData.map(({position, color}, index) => {
      const object = new Object3D();
      object.position.set(
        position.x*ratio,
        position.y*ratio,
        position.z*ratio
      );
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
      args={[boxGeometry, material, voxelsData.length ]}
    />
  );
}

export default VoxelInstancedMesh;