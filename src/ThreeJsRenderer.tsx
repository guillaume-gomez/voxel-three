import { Object3D } from "three";
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Voxelizer from "./Voxelizer";
import SkyBox from "./SkyBox";
import {
    CameraControls,
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
  randomizePosition: boolean;
  gridSize: number;
  selectedObject: Object3D| null;
  blockSize: number;
  displayModel: boolean;
}


function ThreeJsRenderer({
    gridSize,
    blockSize,
    randomizePosition,
    selectedObject,
    displayModel,
}: ThreeJsRendererProps) {
    const cameraControlRef = useRef<CameraControls|null>(null);

    return (
        <Canvas
            className="w-full"
            style={{background: "grey"}}
            dpr={window.devicePixelRatio}
            camera={{ fov: 75, position: [0, 5, 10] }}
            shadows
        >
            <SkyBox size={50} />
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            {
                selectedObject && <>
                    <Voxelizer
                        object3D={selectedObject}
                        gridSize={gridSize}
                        blockSize={blockSize}
                        randomizePosition={randomizePosition}
                        visible={!displayModel}
                    />
                    <primitive
                      position={[0,3,0]}
                      rotation={[0,0,0]}
                      scale={1}
                      object={selectedObject}
                      visible={displayModel}
                    />
                </>
            }
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

            <CameraControls makeDefault maxDistance={20} ref={cameraControlRef} />
            <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
                <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
        </Canvas>
    );
}

export default ThreeJsRenderer;
