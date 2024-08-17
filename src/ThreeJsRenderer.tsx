import { Object3D, DoubleSide, Group, Object3DEventMap } from "three";
import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Voxelizer from "./Voxelizer";
import BoxHelperMesh from "./BoxHelperMesh";
import Model from "./Model";
import SkyBox from "./SkyBox";

import {
    OrbitControls,
    CameraControls,
    Torus,
    Sphere,
    TorusKnot,
    Stage,
    Grid,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Plane,
    Box
} from '@react-three/drei';


export const modelPaths = [
    { path: "Buggy.glb", rotation: [0,0,0], position: [0,0,0] },
    { path: "Commodore.glb", rotation: [0,Math.PI,0], position: [0,0,0] },
    { path: "Donut.glb", rotation: [0,0,0], position: [0,0,0] },
    { path: "Go_Kart.glb", rotation: [0,0,0], position: [0,1,0] },
    { path: "Hamburger.glb", rotation: [0,0,0], position: [0,0,0] },
    { path: "Rainbow.glb", rotation: [0,Math.PI/2,0], position: [0,0,0] },
    { path: "Lost_Explorer.glb", rotation: [0,Math.PI/2,0], position: [0,2,0] },
    { path: "Typewriter.glb", rotation: [0,Math.PI,0], position: [0,0,0] }
];

export type TypeOfGeometry = 'rounded' | 'box';

interface ThreeJsRendererProps {
  typeOfGeometry: TypeOfGeometry;
  randomizePosition: boolean;
  gridSize: number;
  blockSize: number;
  selectedObject: string|null;
}


function ThreeJsRenderer({
    gridSize,
    blockSize,
    typeOfGeometry,
    randomizePosition,
    selectedObjectIndex,
    onSelected
}: ThreeJsRendererProps) {
    const cameraControlRef = useRef<CameraControls|null>(null);
    const [geometriesType] = useState<string>("torus");
    const [showObject] = useState<boolean>(false);
    const [selectedObject3D, setSelectedObject3D] = useState<Object3D| null>(null);
    const objectRef = useRef<Object3D<Object3DEventMap>>(null);
    const modelsRef = useRef<Group[]>(Array.from({ length: modelPaths.length }, () => null));

    useEffect(() => {
         setSelectedObject3D(modelsRef!.current[selectedObjectIndex]);
    }, [selectedObjectIndex]);

    useEffect(() => {
        if(selectedObject3D) {
            onStart(selectedObject3D);
        }
    }, [selectedObject3D]);

    async function onStart(mesh : InstancedMesh) {
        if(cameraControlRef.current) {
          await cameraControlRef.current.fitToBox(mesh, true,
            { paddingLeft: 3, paddingRight: 3, paddingBottom: 3, paddingTop: 3 }
          );
          const cameraPosition = cameraControlRef.current.getPosition();
          const y = Math.min(30, cameraPosition.y + 3);
          await cameraControlRef.current.moveTo(0, y, 0, true);
        }
    }

    return (
           <>
            <Canvas
                className="w-full"
                style={{background: "grey"}}
                dpr={window.devicePixelRatio}
                camera={{ pov: 75, position: [0, 0, 10] }}
                shadows
            >
            <SkyBox size={50} />

                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    {modelsRef.current.map((modelRef, index) => {
                        return (<Model
                            position={modelPaths[index].position}
                            rotation={modelPaths[index].rotation}
                            groupRef={el => modelsRef.current[index] = el}
                            visible={false}
                            path={modelPaths[index].path}
                            autoScale
                        />)
                        })
                    }
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
                        blockSize={blockSize}
                        randomizePosition={randomizePosition}
                    />
                    <Plane
                        args={[50, 50]}
                        rotation={[-Math.PI/2,0,0]}
                        position={[0,0,0]}
                        castShadow
                    >
                        <meshStandardMaterial color="#353540" envMapIntensity={0.1} />
                    </Plane>
                    <Box
                        args={[50, 50, 1]}
                        rotation={[-Math.PI/2,0,0]}
                        position={[0,25,0]}

                    >
                        <meshStandardMaterial color="#360907" />
                    </Box>
                    {import.meta.env.MODE === "development" &&
                        <group>
                            <Grid args={[50, 50]} position={[0, -3.5,0]} cellColor='white' />
                            <Stats/>
                        </group>
                    }

                    <CameraControls makeDefault maxDistance={15} ref={cameraControlRef} />
                    <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
                        <GizmoViewport labelColor="white" axisHeadScale={1} />
                    </GizmoHelper>
            </Canvas>
      </>
    );
}

export default ThreeJsRenderer;
