import { useState } from "react";
import { isMobile } from 'react-device-detect';
import ThreeJsRenderer, { TypeOfGeometry, modelPaths }  from "./ThreeJsRenderer";
import Range from './Range';
import Toggle from "./Toggle";


function App() {
  const [typeOfGeometry, setTypeOfGeometry] = useState<TypeOfGeometry>(isMobile ? 'box' : 'rounded');
  const [gridSize, setGridSize] = useState<number>(0.2);
  const [blockSize, setBlockSize] = useState<number>(0.2);
  const [randomizePosition, setRandomizePosition] = useState<boolean>(false);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState<string|null>(null);

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
              <div className="form-control">
                <label className="label cursor-pointer gap-2 px-0">
                  <span className="label-text font-semibold">Model to render</span>
                  <select className="select select-primary" onChange={(e) => {setSelectedObjectIndex(e.target.value)}}>
                    <option key={-1} value={-1}>Select Model</option>
                    {
                        modelPaths.map((modelPath, index) => {
                            return <option key={modelPath} value={index}>{modelPath}</option>
                        })
                    }
                    </select>
                  </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ThreeJsRenderer
        gridSize={gridSize}
        blockSize={blockSize}
        typeOfGeometry={typeOfGeometry}
        randomizePosition={randomizePosition}
        selectedObjectIndex={selectedObjectIndex}
      />
    </div>
  )
}

export default App
