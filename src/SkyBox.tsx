import { BackSide } from "three";
import { GradientTexture } from '@react-three/drei';

interface SkyBoxProps {
  size: number;
}

function SkyBox({size}: SkyBoxProps) {
    return(
    <mesh position={[0,0,0]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial side={BackSide}>
        <GradientTexture
          stops={[0 ,0.25, 0.60, 1]} // As many stops as you want
          colors={["#3b160c", "#d15a84", "#f1c276", "#f3dab0" ]} // Colors need to match the number of stops
          size={1024} // Size is optional, default = 1024
        />
      </meshBasicMaterial>
    </mesh>);
}
export default SkyBox;