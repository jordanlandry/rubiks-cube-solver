// This is the black cube inside the whole cube

import { properties } from "../properties";

export default function BaseCube() {
  return (
    <mesh scale={properties.cubeScale}>
      <boxGeometry attach="geometry" />
      <meshStandardMaterial color="black" attach="material" />
    </mesh>
  );
}
