import {  Object3D, DoubleSide, Group, Object3DEventMap } from "three";
import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Voxelizer from "./Voxelizer";
import BoxHelperMesh from "./BoxHelperMesh";
import Model from "./Model";
import SkyBox from "./SkyBox";

import { OrbitControls, Torus, Sphere,TorusKnot, Stage, Grid, Stats } from '@react-three/drei';


function ThreeJsRenderer() {
    const [ gridSize ] = useState<number>(0.2);
    const [geometriesType] = useState<string>("torus knot");
    const [randomizePosition] = useState<boolean>(false);
    const [showObject, setShowObject] = useState<boolean>(true);
    const [selectedObject3D, setSelectedObject3D] = useState<Object3D| null>(null);
    const objectRef = useRef<Object3D<Object3DEventMap>>(null);
    const modelRef= useRef<Group>(null);

    console.log(modelRef.current)

    return (
        <div style={{width:"100%", height: "75%"}}>
            <button onClick={() => setSelectedObject3D(objectRef!.current)}>Generate</button>
            <button onClick={() => setSelectedObject3D(modelRef!.current)}>Select Donut</button>
            <Canvas
                style={{background: "grey", width: 500, height: 500}}
                //camera={{ position: [0,0, 1], fov: 75, far: 1000 }}
                //shadowMapSoft={true}
                dpr={window.devicePixelRatio}

                shadows
            >
            <SkyBox />
                    <Stage
                        environment={null}
                        adjustCamera
                        preset="rembrandt"
                    >
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    {/*<Box
                        args={[10, 10, 2]}
                        rotation={[Math.PI/2,0,0]}
                        position={[0,-5,0]}
                    >
                        <meshStandardMaterial color="hotpink" />
                    </Box>*/}
                    <Model
                        position={[0,0,0]}
                        rotation={[0,0,0]}
                        groupRef={modelRef}
                        autoScale
                    />
                    <BoxHelperMesh>
                        {geometriesType === "torus" &&
                            <Torus
                                args={[2, 1, 30, 30]}
                                ref={objectRef}
                                visible={showObject}
                            >
                                <meshStandardMaterial color="blue" wireframe={true} side={DoubleSide} />
                            </Torus>
                        }
                        {geometriesType === "torus knot" &&
                            <TorusKnot
                                args={[2, 0.6, 50, 10]}
                                ref={objectRef}
                                visible={showObject}
                            >
                                <meshStandardMaterial color="purple" wireframe={true} side={DoubleSide} />
                            </TorusKnot>
                        }
                        {geometriesType === "sphere" &&
                            <Sphere ref={objectRef}
                                    visible={showObject}
                            >
                              <meshStandardMaterial color="blue" wireframe={true} side={DoubleSide} />
                            </Sphere>
                        }
                    </BoxHelperMesh>
                    <Voxelizer
                        object3D={selectedObject3D}
                        gridSize={gridSize}
                        randomizePosition={randomizePosition}
                    />
                    </Stage>
                    {import.meta.env.MODE === "development" &&
                        <group>
                            <Grid args={[50, 50]} position={[0, -3.5,0]} cellColor='white' />
                            <Stats/>
                        </group>
                    }

                    <OrbitControls makeDefault />
            </Canvas>
      </div>
    );
}

export default ThreeJsRenderer;
