
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, DocumentIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  multiple?: boolean;
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, multiple = false, maxSizeMB = 5 }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const maxSize = maxSizeMB * 1024 * 1024;

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError(`Ficheiro muito grande. O tamanho máximo é de ${maxSizeMB}MB.`);
      return;
    }

    const newFiles = multiple ? [...files, ...acceptedFiles] : [...acceptedFiles];
    setFiles(newFiles);
    onFileUpload(newFiles);
  }, [files, multiple, onFileUpload, maxSize, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });
  
  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFileUpload(newFiles);
  };
  
  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors
                    ${isDragActive ? 'border-reviva-green bg-reviva-green/10' : 'border-slate-300 dark:border-slate-600 hover:border-reviva-green/50'}`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="h-10 w-10 mx-auto text-slate-400 mb-2"/>
        {isDragActive ? (
          <p className="text-reviva-green">Solte os ficheiros aqui...</p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Arraste e solte ficheiros aqui, ou <span className="font-bold text-reviva-green">clique para selecionar</span>.
          </p>
        )}
        <p className="text-xs text-slate-400 mt-1">Tamanho máximo por ficheiro: {maxSizeMB}MB.</p>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-sm mb-2">Ficheiros Selecionados:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                    <DocumentIcon className="h-5 w-5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-slate-400 text-xs flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button type="button" onClick={() => removeFile(file)} className="p-1 text-red-500 hover:text-red-700">
                    <XCircleIcon className="h-5 w-5"/>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
