import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { CameraIcon, ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  initialImage?: string | null;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, initialImage }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [image, setImage] = useState<string | null>(initialImage || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setImage(initialImage || null);
  }, [initialImage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      alert("Não foi possível aceder à câmera. Verifique as permissões no seu navegador.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setImage(dataUrl);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-64 h-48 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
        {image && !isStreaming && (
           <img src={image} alt="Foto do Aluno" className="w-full h-full object-cover" />
        )}
        {!image && !isStreaming && (
            <UserCircleIcon className="w-24 h-24 text-slate-400 dark:text-slate-500" />
        )}
        {isStreaming && (
            <video ref={videoRef} className="w-full h-full object-cover" />
        )}
      </div>
       <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!isStreaming && (
        <Button type="button" variant="secondary" onClick={startCamera}>
          <CameraIcon className="h-5 w-5 mr-2" /> {image ? 'Tirar Nova Foto' : 'Abrir Câmera'}
        </Button>
      )}

      {isStreaming && (
        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={stopCamera}>
            Cancelar
          </Button>
          <Button type="button" onClick={capturePhoto}>
            Capturar Foto
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
