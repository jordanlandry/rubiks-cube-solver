import { useEffect, useRef, useState } from "react";
import { properties } from "../properties";
import BaseCube from "./BaseCube";
import Side from "./Side";
import { Mesh, Object3D } from "three";
import nextId from "react-id-generator";
import { extend } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import myFont from "../fonts/font.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

export type Position = { side: number; position: number };
type Props = {
  sides: number;
};

type CubeState = {
  side: number;
  position: number;
  color: number;
  ref: any;
};

extend({ TextGeometry });
const font = new FontLoader().parse(myFont);

export default function Cube({ sides }: Props) {
  const startState: CubeState[] = [];
  if (startState.length === 0) {
    for (let side = 0; side < 6; side++) {
      for (let position = 0; position < sides * sides; position++) {
        startState.push({ side, position, color: side, ref: useRef<any>(null) });
      }
    }
  }

  const [cubeState, setCubeState] = useState<CubeState[]>(startState);

  // Create meshes for each tile
  const elements = cubeState.map((c) => {
    return (
      <mesh key={nextId()} ref={c.ref}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={properties.colors[c.color].value} />
        {/* Temp to show the coordinates of each tile */}
        {/* @ts-ignore */}
        <textGeometry args={[`${c.position}`, { font, size: 0.25, height: 0.01 }]} />
      </mesh>
    );
  });

  // Set the position and rotation of each tile every time the cubeState changes
  const TILE_SIZE = properties.cubeScale / properties.sides;
  useEffect(() => {
    // Go through each space
    for (let i = 0; i < cubeState.length; i++) {
      const x = (cubeState[i].position % sides) * TILE_SIZE - (properties.cubeScale / 2 - TILE_SIZE / 2);
      const y = Math.floor(cubeState[i].position / sides) * TILE_SIZE - (properties.cubeScale / 2 - TILE_SIZE / 2);

      // FRONT SIDE
      if (cubeState[i].side === 0) {
        cubeState[i].ref.current.rotation.set(0, 0, 0);
        cubeState[i].ref.current.position.set(x, y, properties.cubeScale / 2 + 0.01);
      }

      // RIGHT SIDE
      if (cubeState[i].side === 1) {
        cubeState[i].ref.current.rotation.set(0, Math.PI / 2, 0);
        cubeState[i].ref.current.position.set(properties.cubeScale / 2 + 0.01, y, -x);
      }

      // BACK SIDE
      if (cubeState[i].side === 2) {
        cubeState[i].ref.current.rotation.set(0, Math.PI, 0);
        cubeState[i].ref.current.position.set(-x, y, -properties.cubeScale / 2 - 0.01);
      }

      // LEFT SIDE
      if (cubeState[i].side === 3) {
        cubeState[i].ref.current.rotation.set(0, (3 * Math.PI) / 2, 0);
        cubeState[i].ref.current.position.set(-properties.cubeScale / 2 - 0.01, y, x);
      }

      // TOP SIDE
      if (cubeState[i].side === 4) {
        cubeState[i].ref.current.rotation.set((3 * Math.PI) / 2, 0, 0);
        cubeState[i].ref.current.position.set(x, properties.cubeScale / 2 + 0.01, -y);
      }

      // BOTTOM SIDE
      if (cubeState[i].side === 5) {
        cubeState[i].ref.current.rotation.set(Math.PI / 2, 0, 0);
        cubeState[i].ref.current.position.set(x, -properties.cubeScale / 2 - 0.01, y);
      }

      // Set the scale of each tile each is - 0.01 to avoid tiles touching each other so you can distinguish them
      cubeState[i].ref.current.scale.set(
        properties.cubeScale / properties.sides - 0.01,
        properties.cubeScale / properties.sides - 0.01,
        properties.cubeScale / properties.sides - 0.01
      );
    }
  }, [cubeState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setCubeState((prev) => {
          // Test a turn of the front face clockwise
          const newState = [...prev];
          const frontFace = newState.filter((c) => c.side === 0);
          const rightFace = newState.filter((c) => c.side === 1);
          const leftFace = newState.filter((c) => c.side === 3);
          const topFace = newState.filter((c) => c.side === 4);
          const bottomFace = newState.filter((c) => c.side === 5);

          // Rotate the front face clockwise
          const temp = [rightFace[0].color, rightFace[3].color, rightFace[6].color];

          rightFace[0].color = topFace[0].color;
          rightFace[3].color = topFace[1].color;
          rightFace[6].color = topFace[2].color;

          topFace[0].color = leftFace[2].color;
          topFace[1].color = leftFace[5].color;
          topFace[2].color = leftFace[8].color;

          leftFace[2].color = bottomFace[6].color;
          leftFace[5].color = bottomFace[7].color;
          leftFace[8].color = bottomFace[8].color;

          bottomFace[6].color = temp[0];
          bottomFace[7].color = temp[1];
          bottomFace[8].color = temp[2];

          // Rotate the front face
          const temp1 = frontFace[0].color;
          frontFace[0].color = frontFace[2].color;
          frontFace[2].color = frontFace[8].color;
          frontFace[8].color = frontFace[6].color;
          frontFace[6].color = temp1;

          const temp2 = frontFace[1].color;
          frontFace[1].color = frontFace[5].color;
          frontFace[5].color = frontFace[7].color;
          frontFace[7].color = frontFace[3].color;
          frontFace[3].color = temp2;

          return newState;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <BaseCube />
      {elements}
    </>
  );
}
