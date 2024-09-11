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
    { path: "Buggy.glb", rotation: [0,0,0], position: [0,0,0] },
    { path: "Commodore.glb", rotation: [0,Math.PI,0], position: [0,0,0] },
    { path: "Donut.glb", rotation: [0,0,0], position: [0,0,0] },
    { path: "Go_Kart.glb", rotation: [0,0,0], position: [0,1,0] },
    { path: "Hamburger.glb", rotation: [0,0,0], position: [0,0,0] },
    { path: "Rainbow.glb", rotation: [0,Math.PI/2,0], position: [0,0,0] },
    { path: "Lost_Explorer.glb", rotation: [0,Math.PI/2,0], position: [0,2,0] },
    { path: "Typewriter.glb", rotation: [0,Math.PI,0], position: [0,0,0] }
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
      torus.position.set(0, 3, 0);

      const torusKnotGeometry = new TorusKnotGeometry( 2, 0.6, 50, 10 );
      let torusKnot = new Mesh(torusKnotGeometry, material);
      torusKnot.name = "Torus Knot";
      torusKnot.position.set(0,3,0);

      const sphereGeometry = new SphereGeometry();
      let sphere = new Mesh(sphereGeometry, material);
      sphere.name = "Sphere";
      sphere.position.set(0,2,0);

      async function loadModels(existingModels : Object3D[]) {
        // then load 3d models
        const models : Object3D[] = [];
        for(const model of modelPaths) {
            try {
              const url = model.path
              let { scene } = await modelLoader(url)
              const boundingBox = new Box3().setFromObject(scene);
              const size = boundingBox.getSize(new Vector3());
              const scaleFactor = MAX_SIZE / size.length();

              scene.name = url;
              scene.position.set(...model.position as [number, number, number]);
              scene.rotation.set(...model.rotation as [number, number, number]);
              scene.scale.multiplyScalar(scaleFactor);

              scene.traverse((child : Object3D) => {
                if (child instanceof Mesh) {
                    child.position.set(...model.position as [number, number, number]);
                    child.rotation.set(...model.rotation as [number, number, number]);
                    child.scale.multiplyScalar(scaleFactor);
                }
              });

              scene.updateWorldMatrix(true, true);
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
         <select className="select select-primary" onChange={(e) => onSelected(listOfOjects[parseInt(e.target.value, 10)]) }>
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