import { Object3D, DoubleSide, Group, Object3DEventMap } from "three";
import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Voxelizer from "./Voxelizer";
import BoxHelperMesh from "./BoxHelperMesh";
import Model from "./Model";
import SkyBox from "./SkyBox";

import {
    OrbitControls,
    Torus,
    Sphere,
    TorusKnot,
    Stage,
    Grid,
    Stats,
    GizmoHelper,
    GizmoViewport
} from '@react-three/drei';


export type TypeOfGeometry = 'rounded' | 'box';

interface ThreeJsRendererProps {
  typeOfGeometry: TypeOfGeometry;
  randomizePosition: boolean;
  //selectedObject3D: Object3D|null;
  gridSize: number;
}


function ThreeJsRenderer({ gridSize, typeOfGeometry, randomizePosition, /*selectedObject3D*/ }: ThreeJsRendererProps) {
    const [geometriesType] = useState<string>("torus");
    const [showObject, setShowObject] = useState<boolean>(false);
    const [selectedObject3D, setSelectedObject3D] = useState<Object3D| null>(null);
    const objectRef = useRef<Object3D<Object3DEventMap>>(null);
    const modelRef= useRef<Group>(null);

    return (
        <>
            <div className="flex flex-row gap-3">
                <button className="btn btn-primary" onClick={() => setSelectedObject3D(objectRef!.current)}>Generate</button>
                <button className="btn btn-primary" onClick={() => setSelectedObject3D(modelRef!.current)}>Select Donut</button>
            </div>

            <Canvas
                className="w-full"
                style={{background: "grey", height: "80vh"}}
                //shadowMapSoft={true}
                dpr={window.devicePixelRatio}

                shadows
            >
            <SkyBox size={30} />
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
                        visible={false}
                        autoScale
                    />
                    <BoxHelperMesh>
                        {geometriesType === "torus" &&
                            <Torus
                                args={[2, 1, 30, 30]}
                                ref={objectRef}
                                visible={showObject}
                            >
                                <meshStandardMaterial color="blue" wireframe={false} side={DoubleSide} />
                            </Torus>
                        }
                        {geometriesType === "torus knot" &&
                            <TorusKnot
                                args={[2, 0.6, 50, 10]}
                                ref={objectRef}
                                visible={showObject}
                            >
                                <meshStandardMaterial color="purple" wireframe={false} side={DoubleSide} />
                            </TorusKnot>
                        }
                        {geometriesType === "sphere" &&
                            <Sphere ref={objectRef}
                                    visible={showObject}
                            >
                              <meshStandardMaterial color="blue" wireframe={false} side={DoubleSide} />
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

                    <OrbitControls makeDefault maxDistance={15} />
                    <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
                        <GizmoViewport labelColor="white" axisHeadScale={1} />
                    </GizmoHelper>
            </Canvas>
      </>
    );
}

export default ThreeJsRenderer;
