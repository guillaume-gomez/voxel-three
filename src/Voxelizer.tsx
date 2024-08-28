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
import { useState, useEffect, useMemo } from 'react';
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

// default size
const SIZE = 0.2;
const BOX_GEOMETRY = new BoxGeometry(SIZE, SIZE, SIZE);

const lambertMaterial =  new MeshLambertMaterial({ emissive: 0x000000 })
const basicMaterial =  new MeshBasicMaterial({ emissive: 0x000000 })


function Voxelizer({object3D, gridSize=0.2, blockSize, randomizePosition=false} : VoxelizerProps) {
    const [voxelsData, setVoxelsData] = useState<VoxelData[]>([]);
    const [geometry, setGeometry] = useState<BufferGeometry>(BOX_GEOMETRY);
    const [material, setMaterial] = useState<Material>(lambertMaterial);
    const geometries = useMemo(() => {
        let boxGeometry = new BoxGeometry(blockSize, blockSize, blockSize);
            boxGeometry.name = "low-perf";

        let roundedBoxGeometry = new RoundedBoxGeometry(blockSize, blockSize, blockSize, 2 , 0.05);
            roundedBoxGeometry.name = "high-perf";

        return [
            boxGeometry,
            roundedBoxGeometry
        ];
    },
    [blockSize]);

    usePerformanceMonitor({
        onIncline: () => {
            if(geometry.name !== "high-perf") {
                    setGeometry(geometries[1]);
                }
                setMaterial(lambertMaterial);
        },
        onDecline: ({fps}) => {
            console.log("decline ", fps);
            if(geometry.name !== "low-perf") {
                    setGeometry(geometries[0]);
                }
                setMaterial(basicMaterial);
        },
        onChange: ({fps}) => {
            console.log("fps -> ",  fps)
            // use faster or lower geometries based on the fps
            if(fps >= 60) {
                if(geometry.name !== "high-perf") {
                    setGeometry(geometries[1]);
                }
                setMaterial(lambertMaterial);
            }
            if(fps > 30) {
                if(geometry.name !== "low-perf") {
                    setGeometry(geometries[0]);
                }
            } else {
                if(geometry.name !== "low-perf") {
                    setGeometry(geometries[0]);
                }
                setMaterial(basicMaterial);
            }
        }
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
                    voxels = [...voxels, ...voxelizeMesh2(child)];
                }
            });
            console.log(voxels.length)
            setVoxelsData(voxels);
            api.start();
        }

    }, [object3D, gridSize]);

    function voxelizeMesh2(mesh: Object3D) {
        const voxels : VoxelData[] = [];
        let voxelsPositionHash = {};
        let indexPosition = 0;

        const boundingBox = new Box3().setFromObject(mesh);

        for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
            for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
                for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
                    const x = i + gridSize/2;
                    const y = j + gridSize/2;
                    const z = k + gridSize/2;

                    const centerPosition = new Vector3(x, y, z);
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

                        voxelsPositionHash = { [createKey(x,y,z)]: indexPosition, ...voxelsPositionHash };
                        indexPosition++;
                    }
                }
            }
        }

        //remove inner voxels
        for(let i=0; i < voxels.length; i++) {
            const {x, y, z} = voxels[i].position;
             if(isInner(voxelsPositionHash, x, y, z)) {
                voxels.splice(i, 1);
                //voxels[i] = { position: voxels[i].position, color: new Color(0xFF23DD)}
            }
        }
        console.log("numberOfInstancesDeleted : ", Object.keys(voxelsPositionHash).length - voxels.length)
        //setVoxelsData(voxels);
        return voxels;
    }

    function createKey(x: number, y: number, z: number) : string {
        const xFixed = x.toFixed(5);
        const yFixed = y.toFixed(5);
        const zFixed = z.toFixed(5);

        return `${xFixed}#${yFixed}#${zFixed}`;
    }

    function hasUpSibling(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return !!voxelsPositionHash[createKey(x,y-gridSize,z)];
    }

    function hasDownSibling(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return !!voxelsPositionHash[createKey(x,y +gridSize,z)];
    }

    function hasLeftSibling(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return !!voxelsPositionHash[createKey(x - gridSize,y,z)];
    }

    function hasRightSibling(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return !!voxelsPositionHash[createKey(x + gridSize,y,z)];
    }

    function hasFrontSibling(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return !!voxelsPositionHash[createKey(x,y,z - gridSize)];
    }

    function hasBackSibling(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return !!voxelsPositionHash[createKey(x,y,z + gridSize)];
    }

    function isInner(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return (
            hasBackSibling(voxelsPositionHash,x,y,z) &&
            hasFrontSibling(voxelsPositionHash,x,y,z) &&
            hasLeftSibling(voxelsPositionHash,x,y,z) &&
            hasRightSibling(voxelsPositionHash,x,y,z) &&
            hasUpSibling(voxelsPositionHash,x,y,z) &&
            hasDownSibling(voxelsPositionHash,x,y,z)
        );
    }

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
        return rayCasterIntersects.length % 2 === 1; //  && rayCasterIntersects[0].distance <= 1.5 * gridSize;
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
                material={material}
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


