import { Box3, Vector3, Color, Object3D, Raycaster } from "three";
import { useState, useEffect } from 'react';
import VoxelInstancedMesh, { VoxelData } from "./VoxelInstancedMesh";

interface VoxelizerProps {
    object3D: Object3D | null;
    gridSize?: number;
    randomizePosition?: boolean
}

function Voxelizer({object3D, gridSize=0.2, randomizePosition=false} : VoxelizerProps) {
    const [voxelsData, setVoxelsData] = useState<VoxelData[]>([]);
    
    useEffect(() => {
        if(object3D) {
            voxelizeMesh(object3D);
        }
    }, [object3D])

    function voxelizeMesh(mesh: Object3D) {
        let voxelsPositionHash = {};
        let indexPosition = 0;

        const voxels = [];
        const boundingBox = new Box3().setFromObject(mesh);
        console.log(boundingBox);
        for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
            for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
                for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
                    const x = i + gridSize/2;
                    const y = j + gridSize/2;
                    const z = k + gridSize/2;

                    const centerPosition = new Vector3(x, y, z);
                    if (isInsideMesh(centerPosition, mesh)) {
                        if(randomizePosition) {
                            voxels.push({
                                position:randomize(centerPosition),
                                color: new Color( 0x00F0F0 )
                            });
                        } else {
                            voxels.push({
                                position: centerPosition,
                                color: new Color( 0xffff00 )
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
        setVoxelsData(voxels);
    }

    function createKey(x: number, y: number, z: number) : string {
        const xFixed = x.toFixed(5);
        const yFixed = y.toFixed(5);
        const zFixed = z.toFixed(5);
        
        return `${xFixed}#${yFixed}#${zFixed}`;
    }

    // has bug
    function hasUpSibling(voxelsPositionHash: any, x: number, y: number, z: number) : boolean {
        return !!voxelsPositionHash[createKey(x,y-gridSize,z)];
    }

    // has bug
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
        <VoxelInstancedMesh voxelsData={voxelsData} />
    );
}

export default Voxelizer;
