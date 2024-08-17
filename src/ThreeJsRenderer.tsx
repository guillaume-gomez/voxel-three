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
    GizmoViewport
} from '@react-three/drei';


export const modelPaths = [
    "Buggy.glb",
    "Commodore.glb",
    "Donut.glb",
    "Go_Kart.glb",
    "Hamburger.glb",
    "Rainbow.glb",
    "Lost_Explorer.glb",
    "Typewriter.glb"
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
      cameraControlRef.current.fitToBox(mesh, true,
        { paddingLeft: 1, paddingRight: 1, paddingBottom: 2, paddingTop: 2 }
      );
    }
  }

    return (
           <>
            <Canvas
                className="w-full"
                style={{background: "grey"}}
                //shadowMapSoft={true}
                dpr={window.devicePixelRatio}

                shadows
            >
            <SkyBox size={30} />

                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    {modelsRef.current.map((modelRef, index) => {
                        return (<Model
                            position={[0,0,0]}
                            rotation={[0,0,0]}
                            groupRef={el => modelsRef.current[index] = el}
                            visible={false}
                            path={modelPaths[index]}
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
