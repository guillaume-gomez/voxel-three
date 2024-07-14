import { Box3, Vector3, Color, Object3D, Raycaster, Mesh, DoubleSide } from "three";
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
        console.log(object3D);
        if(object3D) {
            let voxels: VoxelData[] = [];

            object3D.traverse((child) => {
                if (child instanceof Mesh) {
                    child.material.side = DoubleSide;
                    voxels = [...voxels, ...voxelizeMesh(child)];
                }
            });
            setVoxelsData(voxels);
        }

    }, [object3D])

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
        <VoxelInstancedMesh voxelsData={voxelsData} />
    );
}

export default Voxelizer;
