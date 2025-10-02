
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { CameraIcon, ArrowUpTrayIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  initialImage?: string | null;
}

const MAX_WIDTH = 640;
const MAX_HEIGHT = 480;
const IMAGE_QUALITY = 0.8; // 80% quality JPEG

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, initialImage }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [image, setImage] = useState<string | null>(initialImage || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setImage(initialImage || null);
  }, [initialImage]);

  const startCamera = async () => {
    stopCamera(); // Stop any existing stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } } });
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
        let { videoWidth, videoHeight } = videoRef.current;
        let ratio = videoWidth / videoHeight;
        
        let newWidth = MAX_WIDTH;
        let newHeight = newWidth / ratio;

        if (newHeight > MAX_HEIGHT) {
            newHeight = MAX_HEIGHT;
            newWidth = newHeight * ratio;
        }

        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;
        context.drawImage(videoRef.current, 0, 0, newWidth, newHeight);
        
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', IMAGE_QUALITY);
        setImage(dataUrl);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if(canvas && context) {
                let { width, height } = img;
                let ratio = width / height;

                let newWidth = MAX_WIDTH;
                let newHeight = newWidth / ratio;
                if (newHeight > MAX_HEIGHT) {
                    newHeight = MAX_HEIGHT;
                    newWidth = newHeight * ratio;
                }
                
                canvas.width = newWidth;
                canvas.height = newHeight;
                context.drawImage(img, 0, 0, newWidth, newHeight);

                const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
                setImage(dataUrl);
                onCapture(dataUrl);
            }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-64 h-48 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
        {image && !isStreaming && (
           <img src={image} alt="Foto de perfil" className="w-full h-full object-cover" />
        )}
        {!image && !isStreaming && (
            <UserCircleIcon className="w-24 h-24 text-slate-400 dark:text-slate-500" />
        )}
        {isStreaming && (
            <video ref={videoRef} className="w-full h-full object-cover" />
        )}
      </div>
       <canvas ref={canvasRef} style={{ display: 'none' }} />
       <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {!isStreaming && (
        <div className="flex flex-col gap-2 w-full">
            <Button type="button" variant="secondary" onClick={startCamera}>
                <CameraIcon className="h-5 w-5 mr-2" /> {image ? 'Tirar Nova Foto' : 'Abrir Câmera'}
            </Button>
            <Button type="button" variant="secondary" onClick={triggerFileUpload}>
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" /> Carregar Foto
            </Button>
        </div>
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