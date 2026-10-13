import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import shakerUrl from "../assets/cocktail_shaker-transformed.glb";

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
  };
  materials: {
    cocktailshaker_metal: THREE.Material;
  };
};

export default function CocktailShaker(props: ThreeElements["group"]) {
  const { nodes, materials } = useGLTF(shakerUrl) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.Object_4.geometry}
        material={materials.cocktailshaker_metal}
        position={[-0.006, 0.016, 0]}
        scale={[0.052, 0.388, 0.052]}
      />
    </group>
  );
}

useGLTF.preload(shakerUrl);
