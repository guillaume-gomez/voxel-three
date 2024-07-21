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

interface ModelSelectorProps {}

function ModelSelector({  } : ModelSelectorProps) {
  const [selectedObject3D, setSelectedObject3D] = useState<Object3D| null>(null);
  const [listOfOjects, setListOfObjects] = useState<Object3D[]>([]);

  useEffect(() => {
      const material = new MeshBasicMaterial( { color: 0xff44AA } ); 

      const torusGeometry = new TorusGeometry( 2, 1, 30, 30 ); 
      const torus = new Mesh( torusGeometry, material );

      const torusKnotGeometry = new TorusKnotGeometry( 2, 0.6, 50, 10 );
      const torusKnot = new Mesh(torusKnotGeometry, material);

      const sphereGeometry = new SphereGeometry();
      const sphere = new Mesh(sphereGeometry, material);

      setListOfObjects([torus, torusKnot, sphere])
      setSelectedObject3D(torusKnot);
  }, []);
  
  return (
     <div>
        <select onChange={(e) => setSelectedObject3D(listOfOjects[parseInt(e.target.value)]) }>
            <option value="0">torus</option>
            <option value="1">torus knot</option>
            <option value="2">sphere</option>
        </select>
    </div>
  );
}

export default ModelSelector;