import { properties } from "../properties";

type Props = { color: string; position: number[]; side: number };

export default function Tile({ color, position, side }: Props) {
  let x = 0;
  let y = 0;
  let z = 0;

  let rotX = 0;
  let rotY = 0;
  let rotZ = 0;

  z = properties.cubeScale / 2 + 0.01;

  // z = 5;
  x = Math.floor(position[0] - properties.sides / 3);
  y = Math.floor(position[1] - properties.sides / 3);

  y /= properties.sides / 3;
  x /= properties.sides / 3;
  const rotation = [rotX, rotY, rotZ];
  const position3D = [x, y, z];
  const scale = properties.cubeScale / properties.sides - 0.01;

  return (
    // @ts-ignore
    <mesh rotation={rotation} position={position3D} scale={scale}>
      <planeGeometry attach="geometry" />
      <meshStandardMaterial color={color} attach="material" />
    </mesh>
  );
}
