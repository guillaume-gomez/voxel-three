import {GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export function modelLoader(url : string) : Promise<any> {
  return new Promise((resolve, reject) => {
    loader.load(url,
        (data: any) => { resolve(data) },
        () => {},
        reject
    );
  });
}