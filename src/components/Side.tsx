import { useEffect, useRef } from "react";
import { Object3D } from "three";
import { properties } from "../properties";
import { Position } from "./Cube";

type Props = { side: number; position: Position[] };

export default function Side({ side, position }: Props) {
  const ref = useRef<any>(null);
  const temp = new Object3D();
  useEffect(() => {
    // Go through each space in the position to find the correct color
    for (let i = 0; i < position.length; i++) {
      const x = position[i].position % properties.sides;
      const y = Math.floor(position[i].position / properties.sides);

      // set the position
      temp.position.set(
        x - (((properties.sides - 1) / 2) * properties.cubeScale) / properties.sides,
        y - (((properties.sides - 1) / 2) * properties.cubeScale) / properties.sides,
        0
      );

      // Set the scale of the tile so the tiles are not touching
      temp.scale.set(
        (0.99 * properties.cubeScale) / properties.sides,
        (0.99 * properties.cubeScale) / properties.sides,
        (0.99 * properties.cubeScale) / properties.sides
      );

      // Rotate the tile so it is in the correct position
      temp.rotation.set(0, 0, 0);
      if (side === 0) {
        ref.current.rotation.set(0, 0, 0);
      } else if (side === 1) {
        ref.current.rotation.set(0, Math.PI / 2, 0);
      } else if (side === 2) {
        ref.current.rotation.set(0, Math.PI, 0);
      } else if (side === 3) {
        ref.current.rotation.set(0, (3 * Math.PI) / 2, 0);
      } else if (side === 4) {
        ref.current.rotation.set(Math.PI / 2, 0, 0);
      } else if (side === 5) {
        ref.current.rotation.set((3 * Math.PI) / 2, 0, 0);
      }

      temp.position.z += 1.51;
      // Update Matrix
      temp.updateMatrix();
      ref.current.setMatrixAt(i, temp.matrix);
    }

    // temp.position.set(i, 0, 0);
    // temp.updateMatrix();

    // @ts-ignore
  }, []);

  const color = properties.colors[side].value;

  return (
    <instancedMesh ref={ref} args={[null as any, null as any, properties.sides * properties.sides]}>
      <planeGeometry attach="geometry" />
      <meshStandardMaterial color={color} attach="material" />
    </instancedMesh>
  );
}
