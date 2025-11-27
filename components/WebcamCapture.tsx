import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowUpTrayIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  initialImage?: string | null;
}

const MAX_WIDTH = 640;
const MAX_HEIGHT = 480;
const IMAGE_QUALITY = 0.8; // 80% quality JPEG

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, initialImage }) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImage(initialImage || null);
  }, [initialImage]);


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
        {image ? (
           <img src={image} alt="Foto de perfil" className="w-full h-full object-cover" />
        ) : (
            <UserCircleIcon className="w-24 h-24 text-slate-400 dark:text-slate-500" />
        )}
      </div>
       <canvas ref={canvasRef} style={{ display: 'none' }} />
       <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        <div className="flex flex-col gap-2 w-full">
            <Button type="button" variant="secondary" onClick={triggerFileUpload}>
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" /> {image ? 'Alterar Foto' : 'Carregar Foto'}
            </Button>
        </div>
    </div>
  );
};

export default WebcamCapture;