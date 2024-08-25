import {
    Box3,
    Vector3,
    Color,
    Object3D,
    Raycaster,
    Mesh,
    DoubleSide,
    BufferGeometry,
    MeshLambertMaterial,
    MeshBasicMaterial,
    BoxGeometry,
    SphereGeometry
} from "three";
import { useState, useEffect } from 'react';
import VoxelInstancedMesh, { VoxelData } from "./VoxelInstancedMesh";
import { useSpring, easings, useSpringRef } from '@react-spring/web';
import { animated } from '@react-spring/three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { PerformanceMonitor, usePerformanceMonitor } from '@react-three/drei';


interface VoxelizerProps {
    object3D: Object3D | null;
    gridSize?: number;
    blockSize: number;
    randomizePosition?: boolean
}

const TRANSITION_DURATION = 2000; //ms
const DELAY_DURATION = 500; //ms

const SIZE = 0.2;
const ROUNDED_BOX_GEOMETRY = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 2, 0.03);
const BOX_GEOMETRY = new BoxGeometry(SIZE, SIZE, SIZE);



function Voxelizer({object3D, gridSize=0.2, blockSize, randomizePosition=false} : VoxelizerProps) {
    const [voxelsData, setVoxelsData] = useState<VoxelData[]>([]);
    const [geometry, setGeometry] = useState<BufferGeometry>(BOX_GEOMETRY);
    usePerformanceMonitor({
        onIncline: () => {
            console.log("incline", geometry.type);
            if(geometry !== 'SphereGeometry') {
                console.log("znyi")
                //setGeometry(new RoundedBoxGeometry(blockSize, blockSize, blockSize, 2, 0.03));
                setGeometry(new SphereGeometry());
            }
            //setMaterial(lambertMaterial);
        },
        onDecline: () => {
            console.log("decline", geometry.type);
            if(geometry.type !== 'BoxGeometry') {
                console.log("fdjkjdkfjdjf")
                setGeometry(new BoxGeometry(blockSize, blockSize, blockSize));
            }
        },
    });

    const api = useSpringRef();
    const springs = useSpring({
      ref: api,
      from: { rotation: [0,0,0] },
      to: { rotation: [0, Math.PI * 4, 0] },
      delay: DELAY_DURATION,
      config: {
        duration: TRANSITION_DURATION,
        easing: easings.easeOutQuart
      },
      reset: true,
    });

    
    useEffect(() => {
        if(object3D) {
            let voxels: VoxelData[] = [];

            object3D.traverse((child) => {
                if (child instanceof Mesh) {
                    child.material.side = DoubleSide;
                    voxels = [...voxels, ...voxelizeMesh(child)];
                }
            });
            console.log(voxels.length)
            setVoxelsData(voxels);
            api.start();
        }

    }, [object3D, gridSize, geometry.type])

    function voxelizeMesh(mesh: Object3D) : VoxelData[] {
        const voxels : VoxelData[] = [];
        const boundingBox = new Box3().setFromObject(mesh);
        for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
            for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
                for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
                    const centerPosition = new Vector3(i + gridSize/2, j + gridSize/2, k + gridSize/2);
                    if (isInsideMesh(centerPosition, mesh)) {
                        const color = new Color();
                        const {h, s, l} = mesh.material.color.getHSL(color);
                        color.setHSL(h, s * .8, l * .8 + .2);
                        if(randomizePosition) {
                            voxels.push({
                                position:randomize(centerPosition),
                                color
                            });
                        } else {
                            voxels.push({
                                position: centerPosition,
                                color
                            });
                        }
                    }
                }
            }
        }
        return voxels;
    }

    function isInsideMesh(position: Vector3 , mesh: Object3D) {
        const rayCaster = new Raycaster();
        rayCaster.set(position, new Vector3(0,-1,0));
        const rayCasterIntersects = rayCaster.intersectObject(mesh, true);
        // we need odd number of intersections
        return rayCasterIntersects.length % 2 === 1;
    }

    function randomize(position: Vector3) : Vector3 {
        return new Vector3(
            position.x + (Math.random() - 0.5),
            position.y + (Math.random() - 0.5),
            position.z + (Math.random() - 0.5),
        );
    }

    return (
        <animated.group rotation={springs.rotation}>
            <VoxelInstancedMesh
                voxelsData={voxelsData}
                blockSize={blockSize}
                geometry={geometry}
            />
        </animated.group>
    );
}


function VoxelizerWrapper({object3D, gridSize=0.2, blockSize, randomizePosition=false} : VoxelizerProps) {
    return (
        <PerformanceMonitor>
            <Voxelizer
                object3D={object3D}
                gridSize={gridSize}
                blockSize={blockSize}
                randomizePosition={randomizePosition}
            />
        </PerformanceMonitor>
    );
}


export default VoxelizerWrapper;


