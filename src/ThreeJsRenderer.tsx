import {  Object3D, DoubleSide } from "three";
import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Voxelizer from "./Voxelizer";
import BoxHelperMesh from "./BoxHelperMesh";

import { OrbitControls, Torus, Sphere,TorusKnot } from '@react-three/drei';


function ThreeJsRenderer() {
    const [ gridSize ] = useState<number>(0.2);
    const [geometriesType] = useState<string>("sphere");
    const [randomizePosition] = useState<boolean>(false);
    const objectRef = useRef<Object3D>(null);
    const [selectedObject3D, setSelectedObject3D] = useState<Object3D| null>(null);

    return (
        <div style={{width:"100%", height: "75%"}}>
            <button onClick={() => setSelectedObject3D(objectRef!.current)}>Generate</button>
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
                    <BoxHelperMesh>
                        {geometriesType === "torus" &&
                            <Torus
                                args={[2, 1, 30, 30]}
                                ref={objectRef}
                            >
                                <meshStandardMaterial color="blue" wireframe={true} side={DoubleSide} />
                            </Torus>
                        }
                        {geometriesType === "torus knot" &&
                            <TorusKnot
                                args={[2, 0.6, 50, 10]}
                                ref={objectRef}
                            >
                                <meshStandardMaterial color="purple" wireframe={true} side={DoubleSide} />
                            </TorusKnot>
                        }
                        {geometriesType === "sphere" &&
                            <Sphere ref={objectRef}>
                              <meshStandardMaterial color="blue" wireframe={true} side={DoubleSide} />
                            </Sphere>
                        }
                    </BoxHelperMesh>
                    <Voxelizer
                        object3D={selectedObject3D}
                        gridSize={gridSize}
                        randomizePosition={randomizePosition}
                    />
                    <OrbitControls makeDefault />
            </Canvas>
      </div>
    );
}

export default ThreeJsRenderer;
