import React, { useState } from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DocumentArrowDownIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useCoreData } from '../context/CoreDataContext';
import { useFinancialData } from '../context/FinancialContext';
import { useAcademicData } from '../context/AcademicContext';
import { useAdminData } from '../context/AdminContext';

const Backup: React.FC = () => {
  const coreData = useCoreData();
  const financialData = useFinancialData();
  const academicData = useAcademicData();
  const adminData = useAdminData();
  const allData = { ...coreData, ...financialData, ...academicData, ...adminData };

  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    try {
      // Excluir a função de loading e o próprio estado para não incluir no backup
      const { isLoading, ...dataToBackup } = allData;

      const jsonData = JSON.stringify(dataToBackup, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `sge-reviva-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to create backup:", error);
      alert("Ocorreu um erro ao gerar o backup.");
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Backup e Restauração"
        subtitle="Proteja os dados da sua escola criando backups regulares."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                <DocumentArrowDownIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Criar Backup Completo</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Faça o download de todos os dados da aplicação (alunos, finanças, notas, etc.) para um único ficheiro JSON. Guarde este ficheiro num local seguro.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 text-right">
            <Button onClick={handleBackup} disabled={isBackingUp}>
              {isBackingUp ? 'A gerar...' : 'Download do Backup'}
            </Button>
          </div>
        </Card>

        <Card className="opacity-60">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                <ArrowUpTrayIcon className="h-8 w-8 text-slate-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Restaurar a partir de um Backup</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Carregue um ficheiro de backup para restaurar os dados do sistema. <strong className="text-red-500">Atenção:</strong> Esta ação substituirá todos os dados existentes.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 text-right">
            <Button disabled>
              Carregar Ficheiro (Em Breve)
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Backup;
