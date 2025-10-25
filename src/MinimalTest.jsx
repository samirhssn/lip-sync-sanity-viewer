import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// This is a PUBLIC, GENERIC avatar ID with the viseme parameter.
const TEST_URL_WITH_VISEMES = 'https://models.readyplayer.me/68fa12876795d911bec9eedd.glb?morphTargets=Oculus%20Visemes';

function AvatarTest() {
  // Load the model from the URL
  const { scene } = useGLTF(TEST_URL_WITH_VISEMES);

  // This runs ONCE when the model is loaded
  useEffect(() => {
    if (!scene) return;
    
    console.log("Model loaded. Searching for morph targets...");
    let found = false;
    
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary) {
        console.log("%c--- SUCCESS! ---", "color: green; font-size: 1.5em;");
        console.log("Found mesh with morph targets:", child.name);
        console.log(child.morphTargetDictionary);
        found = true;
      }
    });
    
    if (!found) {
      console.error("%c--- FAILURE ---", "color: red; font-size: 1.5em;");
      console.log("This model file does NOT contain morph targets.");
    }
  }, [scene]);

  return <primitive object={scene} />;
}

export default function MinimalTest() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1 style={{position: 'absolute', zIndex: 1, top: '10px', left: '10px'}}>Test Page</h1>
      <Canvas>
        <ambientLight />
        <directionalLight />
        <Suspense fallback={null}>
          <AvatarTest />
        </Suspense>
      </Canvas>
    </div>
  );
}