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
    "Lost_Explorer.glb",
    "Typewriter.glb"
];

export type TypeOfGeometry = 'rounded' | 'box';

interface ThreeJsRendererProps {
  typeOfGeometry: TypeOfGeometry;
  randomizePosition: boolean;
  gridSize: number;
  selectedObject: Object3D| null;
}


function ThreeJsRenderer({
    gridSize,
    typeOfGeometry,
    randomizePosition,
    selectedObject,
}: ThreeJsRendererProps) {
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
                    <Stage
                        environment={null}
                        adjustCamera
                        preset="rembrandt"
                    >
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    <Voxelizer
                        object3D={selectedObject}
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
