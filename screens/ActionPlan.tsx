

import React from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const phases = [
  {
    title: 'Fase 1: Fundação & Gestão Principal',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Estrutura do Projeto e Layout Responsivo', done: true },
      { name: 'Autenticação de Utilizadores', done: true },
      { name: 'Dashboard Principal com Métricas Chave', done: true },
      { name: 'Gestão Completa de Alunos (CRUD)', done: true },
      { name: 'Dashboard Financeiro e Gráficos', done: true },
    ]
  },
  {
    title: 'Fase 2: Gestão Académica',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Gestão de Professores', done: true },
      { name: 'Gestão de Turmas', done: true },
      { name: 'Gestão de Disciplinas', done: true },
      { name: 'Gestão de Plano Curricular por Turma', done: true },
    ]
  },
  {
    title: 'Fase 3: Operações Diárias',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Registro de Assiduidade por Disciplina', done: true },
      { name: 'Lançamento de Notas (Pautas)', done: true },
      { name: 'Calendário de Provas Interativo', done: true },
      { name: 'Calendário Escolar Geral (Eventos e Feriados)', done: true },
    ]
  },
  {
    title: 'Fase 4: Administrativo & Melhorias',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Geração de Relatórios (Alunos, Professores, Financeiro)', done: true },
      { name: 'Página de Plano de Ação do Projeto', done: true },
      { name: 'Integração com Base de Dados Real (Supabase)', done: true },
      { name: 'Melhorias de Performance e Refatoração', done: true },
    ]
  },
  {
    title: 'Fase 5: Expansão e Ecossistema',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Pagamentos Online de Mensalidades (Integração M-Pesa/eMola)', done: true },
      { name: 'Portal do Aluno e Encarregado (Consulta de Notas e Faltas)', done: true },
      { name: 'Sistema de Comunicação (Avisos e Mensagens)', done: true },
      { name: 'Gestão de Biblioteca', done: true },
      { name: 'Módulo de Recursos Humanos Simplificado', done: true },
    ]
  },
  {
    title: 'Fase 6: Melhorias Contínuas & Integrações Futuras',
    status: 'Em Progresso',
    variant: 'warning' as const,
    features: [
      { name: 'Aplicativo Móvel para Pais e Professores', done: false },
      { name: 'Integração com Plataformas EAD (Moodle, Google Classroom)', done: false },
      { name: 'Relatórios Académicos Avançados com IA', done: false },
      { name: 'Gestão de Transporte Escolar', done: false },
    ]
  },
];

const FeatureItem: React.FC<{ done: boolean; children: React.ReactNode }> = ({ children, done }) => (
  <li className="flex items-center space-x-3 py-1">
    <input type="checkbox" checked={done} disabled className="form-checkbox h-5 w-5 text-reviva-green rounded focus:ring-reviva-green-light cursor-not-allowed" />
    <span className={`${done ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
      {children}
    </span>
  </li>
);

const PhaseCard: React.FC<{ phase: typeof phases[0] }> = ({ phase }) => (
  <Card>
    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{phase.title}</h3>
        <Badge variant={phase.variant}>{phase.status}</Badge>
    </div>
    <div className="p-6">
        <ul className="space-y-2">
            {phase.features.map(feature => (
                <FeatureItem key={feature.name} done={feature.done}>
                    {feature.name}
                </FeatureItem>
            ))}
        </ul>
    </div>
  </Card>
);

const ActionPlan: React.FC = () => {
  return (
    <>
      <PageHeader title="Plano de Ação do Projeto" subtitle="Acompanhe o progresso e as futuras funcionalidades do SGE." />
      <div className="space-y-8">
        {phases.map(phase => <PhaseCard key={phase.title} phase={phase} />)}
      </div>
    </>
  );
};

export default ActionPlan;