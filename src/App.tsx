import { useState } from "react";
import ThreeJsRenderer  from "./ThreeJsRenderer";
import { isMobile } from 'react-device-detect';



type TypeOfGeometry = 'rounded' | 'box';

interface Config {
  typeOfGeometry: TypeOfGeometry;
  randomizePosition: boolean;
  selectedObject3D: Object3D|null;
}

function App() {
  const [typeOfGeometry, setTypeOfGeometry] = useState<TypeOfGeometry>(isMobile ? 'box' : 'rounded');

  return (
    <div className="container">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold underline">Voxel Three</h1>
        <div>
        </div>
        <ThreeJsRenderer
          gridSize={0.2}
          typeOfGeometry={typeOfGeometry}
          randomizePosition={false}
        />
      </div>
    </div>
  )
}

export default App
