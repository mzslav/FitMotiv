import { useState } from 'react'
import './App.css'
import Camera from './Camera'

function App() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const toggleCamera = () => setCameraEnabled(prev => !prev);

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <>
      <Camera enabled={cameraEnabled} facingMode={facingMode} />

      <div className='buttonRow'>
        <label className="toggle">
          <input 
            type="checkbox" 
            checked={cameraEnabled}
            onChange={toggleCamera}
          />
          <span className="slider"></span>
          <span className="toggleLabel">{cameraEnabled ? 'On' : 'Off'}</span>
        </label>
        
        <button className='buttonCameraSwitch' onClick={switchCamera}>
          Switch
        </button>
      </div>
    </>
  );
}

export default App;