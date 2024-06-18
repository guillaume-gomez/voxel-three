import { Box3, Vector3, Object3D, Raycaster } from "three";
import { useRef, useState, useEffect } from 'react';
import VoxelInstancedMesh from "./VoxelInstancedMesh";

interface VoxelizerProps {
    object3D: Object3D;
    gridSize?: number;
    randomizePosition?: boolean
}

function Voxelizer({object3D, gridSize=0.2, randomizePosition=false}) {
    const [voxelsData, setVoxelsData] = useState<Vector3[]>([]);
    const torusRef = useRef<Object3D>(null);

    useEffect(() => {
        if(object3D) {
            voxelizeMesh(object3D);
        }
    }, [object3D])

    function voxelizeMesh(mesh: Object3D) {
        const voxels = [];
        const boundingBox = new Box3().setFromObject(mesh);
        for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
            for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
                for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
                    const centerPosition = new Vector3(i + gridSize/2, j + gridSize/2, k + gridSize/2);
                    if (isInsideMesh(centerPosition, mesh)) {
                        if(randomizePosition) {
                            voxels.push(randomize(centerPosition));
                        } else {
                            voxels.push(centerPosition)
                        }
                    }
                }
            }
        }
        setVoxelsData(voxels);
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
