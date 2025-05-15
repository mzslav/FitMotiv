import { useEffect, useRef, useState } from 'react';
import './App.css';

type CameraProps = {
  enabled: boolean;
  facingMode: 'user' | 'environment';
};

function Camera({ enabled, facingMode }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          
          try {
            await videoRef.current.play();
          } catch (playError) {
            console.error('Помилка автоматичного відтворення:', playError);
          }
        }
        
        setPermissionDenied(false);
      } catch (err) {
        console.error('Помилка доступу до камери:', err);
        setPermissionDenied(true);
      }
    }

    function stopCamera() {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    if (enabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [enabled, facingMode]);

  return (
    <div className="camera-container">
      {permissionDenied && (
        <div className="permission-error">
          Camera access is denied. Please grant permission in your device settings.
        </div>
      )}
      
      <video
        ref={videoRef}
        className="camera-video"
        autoPlay
        playsInline
        muted
        width="640"
        height="480"
      />
    </div>
  );
}

export default Camera;