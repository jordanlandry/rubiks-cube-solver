import { useEffect, useRef, useState } from "react";
import { properties } from "../properties";
import BaseCube from "./BaseCube";
import Side from "./Side";
import { Mesh, Object3D } from "three";
import nextId from "react-id-generator";

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

export default function Cube({ sides }: Props) {
  const cubeState: CubeState[] = [];
  for (let side = 0; side < 6; side++) {
    for (let position = 0; position < sides * sides; position++) {
      cubeState.push({ side, position, color: side, ref: useRef<any>(null) });
    }
  }

  const elements = cubeState.map((c) => {
    return (
      <mesh key={nextId()} ref={c.ref}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={properties.colors[c.color].value} />
      </mesh>
    );
  });

  // Set the position and rotation of each tile

  const TILE_SIZE = properties.cubeScale / properties.sides;
  useEffect(() => {
    cubeState[0].ref.current.position.set(0, 3, 0);
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
  }, []);

  return (
    <>
      <BaseCube />
      {elements}
    </>
  );
}
