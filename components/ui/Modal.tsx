import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <Card
        className="w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-reviva-green dark:text-reviva-green-light">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar modal">
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
};
