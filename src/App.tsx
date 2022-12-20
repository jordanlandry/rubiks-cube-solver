import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Cube from "./components/Cube";
import { properties } from "./properties";

function App() {
  return (
    <div className="App">
      <Canvas style={{ height: "100vh" }}>
        <OrbitControls />
        <ambientLight intensity={0.1} />
        <Cube sides={properties.sides} />
      </Canvas>
    </div>
  );
}

export default App;
