import React from 'react';
import PageHeader from '../components/Header';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';

const Settings: React.FC = () => {
  return (
    <>
      <PageHeader title="Configurações do Sistema" subtitle="Gira as configurações globais da aplicação" />
       <Card>
        <div className="flex flex-col items-center justify-center h-full text-center p-16">
            <WrenchScrewdriverIcon className="h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold">Módulo em Desenvolvimento</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">A página de Configurações está a ser construída.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Aqui poderá gerir utilizadores, definir o ano letivo, configurar dados da escola e muito mais.</p>
        </div>
      </Card>
    </>
  );
};

export default Settings;
