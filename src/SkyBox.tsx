import { BackSide } from "three";
import { GradientTexture } from '@react-three/drei';

function SkyBox() {
    return(
    <mesh position={[0,0,0]}>
      <boxGeometry args={[20, 20,20]}  />
      <meshBasicMaterial side={BackSide}>
        <GradientTexture
          stops={[0, 1]} // As many stops as you want
          colors={['aquamarine', 'hotpink']} // Colors need to match the number of stops
          size={1024} // Size is optional, default = 1024
        />
      </meshBasicMaterial>
    </mesh>);
}
export default SkyBox;