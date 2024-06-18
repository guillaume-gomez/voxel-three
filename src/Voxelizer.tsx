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

                    if (isInsideMeshInEachDirection(position, mesh)) {
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

    function isInsideMeshInEachDirection(position: Vector3, mesh: Object3D) :boolean {
        const directions = [
            new Vector3(-1,0,0), new Vector3(1,0,0), // raycast on X
            new Vector3(0,-1,0), new Vector3(0,-1,0), // raycast on Y
            new Vector3(0,0,-1), new Vector3(0,0,1) // raycast on Z
        ];
        for(const direction of directions) {
            if(isInsideMesh(position, direction, mesh)) {
                return true;
            }
        }

        return false;
    }

    function isInsideMesh(position: Vector3 , direction: Vector3, mesh: Object3D) :boolean {
        const rayCaster = new Raycaster(position, direction);
        const rayCasterIntersects = rayCaster.intersectObject(mesh, true);
        // we need odd number of intersections
        // + limit intersections below 1.5 * gridSize (the result is more efficiant than limiting the ray far properties)
        return rayCasterIntersects.length % 2 === 1 && rayCasterIntersects[0].distance <= 1.5 * gridSize;
    }

    function randomize(position: Vector3) : Vector3 {
        return new Vector3(
            position.x + (Math.random() - 0.5),
            position.y + (Math.random() - 0.5),
            position.z + (Math.random() - 0.5),
        );
    }

    console.log(voxelsData.length)

    return (
        <VoxelInstancedMesh voxelsData={voxelsData} />
    );
}

export default Voxelizer;
