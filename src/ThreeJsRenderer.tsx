import { Box3, Vector3, Object3D, BoxHelper, Raycaster } from "three";
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import VoxelInstancedMesh from "./VoxelInstancedMesh";

import { OrbitControls, Torus, Sphere,TorusKnot, useHelper } from '@react-three/drei';

function ThreeJsRenderer() {
    const [ gridSize ] = useState<number>(0.8);
    const [geometriesType, setGeometriesType] = useState<string>("torus");
    const [voxelsData, setVoxelsData] = useState<Vector3[]>([])
    const [helper, setHelper] = useState<boolean>(true);
    const torusRef = useRef<Object3D>(null);

    //useHelper(helper && torusRef, BoxHelper, 'red')

    function voxelizeMesh(mesh) {
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

    function isInsideMesh(position, mesh) {
        const rayCaster = new Raycaster();
        rayCaster.set(position, {x: 0, y: -1, z: 0});
        const rayCasterIntersects = rayCaster.intersectObject(mesh, false);
        console.log(rayCasterIntersects)
        // we need odd number of intersections
        return rayCasterIntersects.length % 2 === 1;
    }

    return (
        <div style={{width:"100%", height: "75%"}}>
            <button onClick={() => voxelizeMesh(torusRef.current)}>Generate</button>
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
                            wireframe={true}
                        >
                            <meshStandardMaterial color="blue" wireframe={true} />
                        </Torus>
                    }
                    {geometriesType === "torus knot" &&
                        <TorusKnot
                            args={[2, 0.6, 50, 10]}
                            material-color="green"
                            ref={torusRef}
                        />
                    }
                    {geometriesType === "sphere" &&
                        <Sphere>
                          <meshStandardMaterial color="green" />
                        </Sphere>
                    }
                    <VoxelInstancedMesh voxelsData={voxelsData} />
                    <OrbitControls makeDefault />
            </Canvas>
      </div>
    );
}

export default ThreeJsRenderer;
