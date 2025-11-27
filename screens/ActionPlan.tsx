
import React from 'react';
import PageHeader from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  ServerIcon, 
  ShieldCheckIcon, 
  SparklesIcon, 
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

// --- Types & Data ---

type Status = 'Concluído' | 'Em Progresso' | 'Pendente';
type Priority = 'Alta' | 'Média' | 'Baixa';

interface Task {
  id: string;
  text: string;
  done: boolean;
  priority?: Priority;
}

interface Phase {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  status: Status;
  progress: number;
  tasks: Task[];
}

const ANALYSIS_DATA = {
  strengths: [
    "UX/UI Moderna e Responsiva (Mobile-First)",
    "Arquitetura Modular baseada em React Context",
    "Integração Supabase avançada (Core, Financial, Academic)",
    "Integração com IA (Gemini) estruturada"
  ],
  weaknesses: [
    "Persistência de dados acadêmicos agora migrada!",
    "Autenticação real pendente (apenas simulada)",
    "Feedback visual (Loading/Toast) precisa de melhorias"
  ]
};

const ROADMAP_DATA: Phase[] = [
  {
    id: 1,
    title: 'Fase 1: Migração para Backend Real (Supabase)',
    icon: <ServerIcon className="h-6 w-6" />,
    description: 'Substituição do armazenamento local por banco de dados PostgreSQL na nuvem para garantir persistência e integridade.',
    status: 'Em Progresso',
    progress: 80, // Updated from 60 to 80 (1.1, 1.2, 1.3, 1.4 done = 4/5 tasks = 80%)
    tasks: [
      { id: '1.1', text: 'Configurar projeto Supabase e variáveis de ambiente (.env)', done: true, priority: 'Alta' },
      { id: '1.2', text: 'Migrar CoreDataContext (Alunos, Profs, Turmas) para fetch/insert no Supabase', done: true, priority: 'Alta' },
      { id: '1.3', text: 'Migrar FinancialContext (Transações, Mensalidades) para Supabase', done: true, priority: 'Alta' },
      { id: '1.4', text: 'Migrar AcademicContext (Notas, Assiduidade, Aulas) para Supabase', done: true, priority: 'Alta' }, // Marked as done
      { id: '1.5', text: 'Configurar Supabase Storage para upload de fotos e documentos', done: false, priority: 'Média' },
    ]
  },
  {
    id: 2,
    title: 'Fase 2: Segurança & Controle de Acesso',
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    description: 'Implementação de autenticação real e políticas de segurança para proteger os dados sensíveis da escola.',
    status: 'Pendente',
    progress: 0,
    tasks: [
      { id: '2.1', text: 'Substituir login simulado por Supabase Auth (Email/Senha)', done: false, priority: 'Alta' },
      { id: '2.2', text: 'Criar tabela "Profiles" vinculada ao Auth ID para gerir Roles', done: false, priority: 'Alta' },
      { id: '2.3', text: 'Implementar RLS (Row Level Security) no banco de dados', done: false, priority: 'Alta' },
      { id: '2.4', text: 'Refatorar ProtectedRoute para verificar sessão real', done: false, priority: 'Alta' },
    ]
  },
  {
    id: 3,
    title: 'Fase 3: Refinamento de UX & UI',
    icon: <DevicePhoneMobileIcon className="h-6 w-6" />,
    description: 'Melhorias na experiência do usuário, feedback visual e prevenção de erros.',
    status: 'Pendente',
    progress: 0,
    tasks: [
      { id: '3.1', text: 'Substituir "alert()" por sistema de Toast Notifications', done: false, priority: 'Média' },
      { id: '3.2', text: 'Adicionar Skeletons/Spinners durante o carregamento de dados', done: false, priority: 'Média' },
      { id: '3.3', text: 'Implementar validação de formulários com Zod + React Hook Form', done: false, priority: 'Média' },
      { id: '3.4', text: 'Melhorar visualização de tabelas em mobile (Cards expandidos)', done: false, priority: 'Baixa' },
    ]
  },
  {
    id: 4,
    title: 'Fase 4: Funcionalidades Avançadas & IA',
    icon: <SparklesIcon className="h-6 w-6" />,
    description: 'Recursos que diferenciam o produto, focados em automação e inteligência.',
    status: 'Pendente',
    progress: 0,
    tasks: [
      { id: '4.1', text: 'Histórico e refinamento de Planos de Aula com IA', done: false, priority: 'Baixa' },
      { id: '4.2', text: 'Análise Preditiva Financeira com dados reais', done: false, priority: 'Baixa' },
      { id: '4.3', text: 'Exportação de Relatórios em PDF/Excel profissionais', done: false, priority: 'Média' },
      { id: '4.4', text: 'Modo Offline (PWA) com sincronização de dados', done: false, priority: 'Baixa' },
    ]
  }
];

// --- Components ---

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const styles = {
    'Concluído': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Em Progresso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Pendente': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const ActionPlan: React.FC = () => {
  return (
    <>
      <PageHeader title="Plano de Ação e Desenvolvimento" subtitle="Roadmap estratégico para evolução do SGE Reviva" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
           <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-none">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-reviva-green-light"/>
                  Diagnóstico do Sistema (v0.8-beta)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2"><CheckCircleIcon className="h-5 w-5"/> Pontos Fortes</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                      {ANALYSIS_DATA.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2"><ExclamationTriangleIcon className="h-5 w-5"/> Atenção Necessária</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                      {ANALYSIS_DATA.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
           </Card>
        </div>
        <div>
           <Card className="h-full flex flex-col justify-center items-center p-6 text-center bg-reviva-green/10 border-reviva-green">
              <h3 className="text-lg font-bold text-reviva-green-dark dark:text-reviva-green-light mb-2">Status Global</h3>
              <div className="text-4xl font-extrabold text-slate-800 dark:text-white mb-1">35%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Conclusão Total do Projeto</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                <div className="bg-reviva-green h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
           </Card>
        </div>
      </div>

      <div className="space-y-6">
        {ROADMAP_DATA.map((phase) => (
          <Card key={phase.id} className={`border-l-4 ${phase.status === 'Concluído' ? 'border-green-500' : phase.status === 'Em Progresso' ? 'border-blue-500' : 'border-slate-300'}`}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                  <div className={`p-3 rounded-lg ${phase.status === 'Concluído' ? 'bg-green-100 text-green-600' : phase.status === 'Em Progresso' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    {phase.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{phase.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{phase.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={phase.status} />
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Progresso: {phase.progress}%</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mb-6">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${phase.status === 'Concluído' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${phase.progress}%` }}></div>
              </div>

              <div className="space-y-3">
                {phase.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-reviva-green/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent'}`}>
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                        <span className="font-mono text-xs text-slate-400 mr-2">{task.id}</span>
                        {task.text}
                      </span>
                    </div>
                    {task.priority && !task.done && (
                      <Badge variant={task.priority === 'Alta' ? 'destructive' : task.priority === 'Média' ? 'warning' : 'default'}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ActionPlan;
