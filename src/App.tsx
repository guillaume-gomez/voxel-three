import { useState } from "react";
import { isMobile } from 'react-device-detect';
import ThreeJsRenderer, { ThreeJsRendererProps, TypeOfGeometry }  from "./ThreeJsRenderer";
import Range from './Range';
import Toggle from "./Toggle";

function App() {
  const [typeOfGeometry, setTypeOfGeometry] = useState<TypeOfGeometry>(isMobile ? 'box' : 'rounded');
  const [gridSize, setGridSize] = useState<number>(0.2);
  const [randomizePosition, setRandomizePosition] = useState<boolean>(false);

  return (
    <div className="container">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold underline">Voxel Three</h1>
        <Range
          label="Precision"
          min={0.2}
          max={2}
          step={0.1}
          value={gridSize}
          onChange={(value) => setGridSize(value)}
        />
        <Toggle
          label="random position"
          value={randomizePosition}
          toggle={() => setRandomizePosition(!randomizePosition)}
        />
        <div>
        </div>
        <ThreeJsRenderer
          gridSize={gridSize}
          typeOfGeometry={typeOfGeometry}
          randomizePosition={randomizePosition}
        />
      </div>
    </div>
  )
}

export default App
