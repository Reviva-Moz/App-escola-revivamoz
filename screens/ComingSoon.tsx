
import React from 'react';
import Header from '../components/Header';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <WrenchScrewdriverIcon className="h-24 w-24 text-gray-400 mb-4" />
      <Header title={title} />
      <p className="text-xl text-gray-600">Este módulo está em desenvolvimento.</p>
      <p className="text-gray-500 mt-2">Fique atento para futuras atualizações!</p>
    </div>
  );
};

export default ComingSoon;
