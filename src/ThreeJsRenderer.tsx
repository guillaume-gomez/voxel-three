import { Box3, Vector3, Object3D, Raycaster, DoubleSide } from "three";
import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import VoxelInstancedMesh from "./VoxelInstancedMesh";

import { OrbitControls, Torus, Sphere,TorusKnot } from '@react-three/drei';


function ThreeJsRenderer() {
    const [ gridSize ] = useState<number>(0.2);
    const [geometriesType] = useState<string>("torus");
    const [voxelsData, setVoxelsData] = useState<Vector3[]>([])
    const torusRef = useRef<Object3D>(null);

    function voxelizeMesh(mesh: Object3D) {
        const voxels = [];
        const boundingBox = new Box3().setFromObject(mesh);
        for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
            for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
                for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
                    const position = new Vector3(i, j, k);
                    if (isInsideMesh(position, mesh)) {
                        voxels.push(position)
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

    return (
        <div style={{width:"100%", height: "75%"}}>
            <button onClick={() => voxelizeMesh(torusRef!.current)}>Generate</button>
            <Canvas
                style={{background: "grey", width: 500, height: 500}}
                //camera={{ position: [0,0, 1], fov: 75, far: 1000 }}
                //shadowMapSoft={true}
                dpr={window.devicePixelRatio}

                shadows
            >
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    {geometriesType === "torus" &&
                        <Torus
                            args={[2, 1, 30, 30]}
                            ref={torusRef}
                        >
                            <meshStandardMaterial color="blue" wireframe={true} side={DoubleSide} />
                        </Torus>
                    }
                    {geometriesType === "torus knot" &&
                        <TorusKnot
                            args={[2, 0.6, 50, 10]}
                            ref={torusRef}
                        />
                    }
                    {geometriesType === "sphere" &&
                        <Sphere>
                          <meshStandardMaterial color="green" wireframe={true} side={DoubleSide} />
                        </Sphere>
                    }
                    <VoxelInstancedMesh voxelsData={voxelsData} />
                    <OrbitControls makeDefault />
            </Canvas>
      </div>
    );
}

export default ThreeJsRenderer;
