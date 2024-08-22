import { Object3D } from "three";
import { useState } from "react";
import { isMobile } from 'react-device-detect';
import ThreeJsRenderer, { TypeOfGeometry }  from "./ThreeJsRenderer";
import Range from './Range';
import Toggle from "./Toggle";
import ModelSelector from "./ModelSelector";



function App() {
  const [gridSize, setGridSize] = useState<number>(0.2);
  const [blockSize, setBlockSize] = useState<number>(0.2);
  const [randomizePosition, setRandomizePosition] = useState<boolean>(false);
  const [selectedObject3D, setSelectedObject3D] = useState<Object3D| null>(null);

  return (
    <div className="w-100 h-screen">
      <div className="lg:absolute md:static lg:top-8 lg:left-8 lg:max-w-xs md:max-w-full md:w-full z-10">
        <div className="card bg-neutral text-neutral-content w-96">
          <div className="card-body">
            <h2 className="card-title">Settings</h2>
            <div>
              <Range
                label="Precision"
                min={0.2}
                max={2}
                step={0.1}
                value={gridSize}
                onChange={(value) => setGridSize(value)}
              />
              <Range
                label="Block Size"
                min={0.2}
                max={2}
                step={0.1}
                value={blockSize}
                onChange={(value) => setBlockSize(value)}
              />
              <Toggle
                label="random position"
                value={randomizePosition}
                toggle={() => setRandomizePosition(!randomizePosition)}
              />
              <ModelSelector onSelected={(newSelectObject3D: Object3D) => setSelectedObject3D(newSelectObject3D)}/>

            </div>
          </div>
        </div>
      </div>
      <ThreeJsRenderer
        gridSize={gridSize}
        blockSize={blockSize}
        randomizePosition={randomizePosition}
        selectedObject={selectedObject3D}
      />
    </div>
  )
}

export default App
