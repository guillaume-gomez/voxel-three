import { useRef , useEffect, useState } from 'react';
import { Object3D, InstancedMesh, MeshLambertMaterial, MeshBasicMaterial, Vector3, Color, BufferGeometry, Material } from 'three';
import { useSpring, useSpringRef, easings} from '@react-spring/web';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { usePerformanceMonitor } from '@react-three/drei';


export interface VoxelData {
  color: Color;
  position: Vector3;
}

interface VoxelInstancedMeshProps {
  voxelsData: VoxelData[];
  blockSize: number;
  geometry : BufferGeometry;
}

const SIZE = 0.2;
const BOX_GEOMETRY = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 2, 0.03);
const lambertMaterial =  new MeshLambertMaterial({ emissive: 0x000000 })
const basicMaterial =  new MeshBasicMaterial({ emissive: 0x000000 })


const TRANSITION_DURATION = 2000; //ms
const DELAY_DURATION = 500; //ms


function VoxelInstancedMesh ({voxelsData, blockSize, geometry } : VoxelInstancedMeshProps) {
  const meshRef = useRef<InstancedMesh>(null);
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
      args={[geometry, lambertMaterial, voxelsData.length ]}
    />
  );
}

export default VoxelInstancedMesh;