
import React from 'react';
import PageHeader from '../components/Header';
import { WrenchScrewdriverIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SparklesIcon } from '../components/icons';

const LessonPlan: React.FC = () => {
  return (
    <>
      <PageHeader title="Plano de Aula" subtitle="Crie e gira os seus planos de aula">
        <div className="flex items-center gap-4">
            <Button variant="secondary" disabled title="Funcionalidade em desenvolvimento">
                <SparklesIcon className="h-5 w-5 mr-2" />
                Pedir Auxílio da IA
            </Button>
            <Button disabled title="Funcionalidade em desenvolvimento">
                <PlusIcon className="h-5 w-5 mr-2" />
                Criar Plano de Aula
            </Button>
        </div>
      </PageHeader>
      <Card>
        <div className="flex flex-col items-center justify-center h-full text-center p-16">
            <WrenchScrewdriverIcon className="h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold">Módulo em Desenvolvimento</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">O módulo de Plano de Aula está a ser construído.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">No futuro, poderá criar, organizar e consultar os seus planos de aula aqui. Também planeamos integrar um assistente de IA para ajudar na sua elaboração.</p>
        </div>
      </Card>
    </>
  );
};

export default LessonPlan;
