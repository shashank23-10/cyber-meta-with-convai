import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { ScenariosProvider } from './context/ScenariosContext';
import { SocketProvider } from './context/SocketContext';
import LoadingScreen from './components/LoadingScreen';
import Scene from './Scene';
import ScenarioControls from './components/ScenarioControls';
import ConvAiIntegration from './ConvAiIntegration';
import './styles.css';


const App = () => {
  return (
    <SocketProvider>
      <ScenariosProvider>
        <Suspense fallback={<div className="loading-overlay"><LoadingScreen /></div>}>
          <div className="app">
            <div className="canvas-container">
              <Canvas
                shadows
                gl={{ antialias: true }}
                camera={{ fov: 75, position: [0, 1.5, 10] }}
              >
              <Scene />
              </Canvas>
            </div>
            <ScenarioControls />
          </div>
        </Suspense>
      </ScenariosProvider>
    </SocketProvider >
  );
};

export default App;
