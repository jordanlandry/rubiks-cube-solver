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
  // const initialPosition = (s: number) => {
  //   const newPos: Position[] = [];
  //   for (let position = 0; position < sides * sides; position++) {
  //     newPos.push({ side: s, position });
  //   }

  //   return newPos;
  // };

  // const [side0, setSide0] = useState<Position[]>(initialPosition(0));
  // const [side1, setSide1] = useState<Position[]>(initialPosition(1));
  // const [side2, setSide2] = useState<Position[]>(initialPosition(2));
  // const [side3, setSide3] = useState<Position[]>(initialPosition(3));
  // const [side4, setSide4] = useState<Position[]>(initialPosition(4));
  // const [side5, setSide5] = useState<Position[]>(initialPosition(5));

  // useEffect(() => {
  //   setSide0((prev) => {
  //     const newPos = [...prev];
  //     newPos[0].side = 1;
  //     return newPos;
  //   });
  // }, []);

  const cubeState: CubeState[] = [];
  for (let side = 0; side < sides; side++) {
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

  useEffect(() => {
    cubeState[0].ref.current.position.set(0, 3, 0);
  }, []);

  return (
    <>
      {/* <BaseCube /> */}
      {elements}
    </>
  );
}
