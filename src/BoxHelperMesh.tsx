import { Object3D, BoxHelper } from "three";
import { useHelper } from '@react-three/drei';

interface BoxHelperMeshProps {
    children: any
}

function BoxHelperMesh({children} : BoxHelperMeshProps) {
    useHelper(children.ref, BoxHelper, "green");
    return (
        <group ref={children.ref}>
            {children}
        </group>
    );
}

export default BoxHelperMesh;
