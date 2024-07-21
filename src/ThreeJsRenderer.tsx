import { 
    Object3D,
    Group,
    Object3DEventMap,
    TorusGeometry,
    TorusKnotGeometry,
    MeshBasicMaterial,
    Mesh,
    SphereGeometry
} from "three";
import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Voxelizer from "./Voxelizer";
import Model from "./Model";
import SkyBox from "./SkyBox";
import ModelSelector from "./ModelSelector";

import {
    OrbitControls,
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
];

export type TypeOfGeometry = 'rounded' | 'box';

interface ThreeJsRendererProps {
  typeOfGeometry: TypeOfGeometry;
  randomizePosition: boolean;
  gridSize: number;
  selectedObject: string|null;
}


function ThreeJsRenderer({
    gridSize,
    typeOfGeometry,
    randomizePosition,
    selectedObjectIndex,
    onSelected
}: ThreeJsRendererProps) {
    const [selectedObject3D, setSelectedObject3D] = useState<Object3D| null>(null);
    const modelsRef = useRef<Group[]>(Array.from({ length: modelPaths.length }, () => null));
    
    useEffect(() => {
         //setSelectedObject3D(modelsRef!.current[selectedObjectIndex]);
         //setSelectedObject3D(objectRef!.current);
    }, [selectedObjectIndex])

    return (
           <>
           <ModelSelector onSelected={(newSelectObject3D: Object3D) => setSelectedObject3D(newSelectObject3D)}/>

            <Canvas
                className="w-full"
                style={{background: "grey"}}
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
