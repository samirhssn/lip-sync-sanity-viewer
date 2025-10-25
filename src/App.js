// In your src/App.jsx
import React from 'react';
import VisemePlayer from './VideoLipSyncClientOnly';
import MinimalTest from './MinimalTest';

function App() {
  return (
    <div className="App">
      <VisemePlayer />
      {/* <MinimalTest/> */}
    </div>
  );
}

export default App;