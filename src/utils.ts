import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export function modelLoader(url : string) {
  return new Promise((resolve, reject) => {
    loader.load(url, data=> resolve(data), null, reject);
  });
}