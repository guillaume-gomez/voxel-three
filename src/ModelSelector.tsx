import { 
    Box3,
    Vector3,
    Object3D,
    TorusGeometry,
    TorusKnotGeometry,
    MeshBasicMaterial,
    Mesh,
    SphereGeometry
} from "three";
import { useState, useEffect } from 'react';
import { modelLoader } from "./utils";


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

const MAX_SIZE = 8;

function ModelSelector({ onSelected } : ModelSelectorProps) {
  const [listOfOjects, setListOfObjects] = useState<Object3D[]>([]);

  useEffect(() => {
      //load basic geometry
      const material = new MeshBasicMaterial( { color: 0xff44AA } ); 

      const torusGeometry = new TorusGeometry( 2, 1, 30, 30 ); 
      let torus = new Mesh( torusGeometry, material );
      torus.name = "Torus";

      const torusKnotGeometry = new TorusKnotGeometry( 2, 0.6, 50, 10 );
      let torusKnot = new Mesh(torusKnotGeometry, material);
      torusKnot.name = "Torus Knot";

      const sphereGeometry = new SphereGeometry();
      let sphere = new Mesh(sphereGeometry, material);
      sphere.name = "Sphere";

      async function loadModels(existingModels : Object3D[]) {
        // then load 3d models
        const models : Object3D[] = [];
        for(const url of modelPaths) {
            try {
              let { scene } = await modelLoader(url)
              const boundingBox = new Box3().setFromObject(scene);
              const size = boundingBox.getSize(new Vector3());
              const scaleFactor = MAX_SIZE / size.length();

              scene.name = url;
              scene.scale.multiplyScalar(scaleFactor);
              scene.traverse((child) => {
                if (child instanceof Mesh) {
                    child.scale.multiplyScalar(scaleFactor);
                }
            });
              scene.updateWorldMatrix(true); 

              models.push(scene);
            } catch(error) {
              console.error(error);
            }
        }
        setListOfObjects([...existingModels, ...models]);
        return models;
      }

      loadModels([torus, torusKnot, sphere]);
      onSelected(torus);
  }, []);

  return (
     <div className="form-control">
       <label className="label cursor-pointer gap-2 px-0">
         <span className="label-text font-semibold">Model to render</span>
         <select className="select select-primary" onChange={(e) => onSelected(listOfOjects[e.target.value]) }>
            {
              listOfOjects.map((object, index) => {
                return (<option key={index} value={index}>{object.name}</option>);
              })
            }
        </select>
      </label>
    </div>
  );
}

export default ModelSelector;