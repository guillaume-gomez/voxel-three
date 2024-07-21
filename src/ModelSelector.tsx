import { 
    Object3D,
    TorusGeometry,
    TorusKnotGeometry,
    MeshBasicMaterial,
    Mesh,
    SphereGeometry
} from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import { useState, useEffect } from 'react';


export const modelPaths = [
    "Buggy.glb",
    "Commodore.glb",
    "Donut.glb",
    "Go_Kart.glb",
    "Hamburger.glb",
    "Rainbow.glb",
];


interface ModelSelectorProps {
  onSelected: (object3D: Object3D) => void;
}

function ModelSelector({ onSelected } : ModelSelectorProps) {
  const [listOfOjects, setListOfObjects] = useState<Object3D[]>([]);

  useEffect(() => {
      //load basic geometry
      const material = new MeshBasicMaterial( { color: 0xff44AA } ); 

      const torusGeometry = new TorusGeometry( 2, 1, 30, 30 ); 
      const torus = new Mesh( torusGeometry, material );

      const torusKnotGeometry = new TorusKnotGeometry( 2, 0.6, 50, 10 );
      const torusKnot = new Mesh(torusKnotGeometry, material);

      const sphereGeometry = new SphereGeometry();
      const sphere = new Mesh(sphereGeometry, material);


      // then load 3d models
      const models : Object3D[] = [];
      const loader = new GLTFLoader();
      modelPaths.forEach(url => {
        loader.load(url, ({scene}) => {
          console.log("loaded mesh")
          models.push(scene);
        });
      });
      console.log("loaded")


      setListOfObjects([torus, torusKnot, sphere, ...models]);
      onSelected(torus);
  }, []);
  
  return (
     <div>
        <select onChange={(e) => onSelected(listOfOjects[e.target.value]) }>
            <option value={0}>torus</option>
            <option value={1}>torus knot</option>
            <option value={2}>sphere</option>
            <option value={3}>test</option>
        </select>
    </div>
  );
}

export default ModelSelector;