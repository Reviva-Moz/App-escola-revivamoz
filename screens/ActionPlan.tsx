

import React from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const phases = [
  {
    title: 'MVP 1: Fundação & Gestão Principal',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Estrutura do Projeto e Layout Responsivo', done: true },
      { name: 'Autenticação por Perfis de Utilizador', done: true },
      { name: 'Dashboard Principal com Métricas Chave', done: true },
      { name: 'Gestão Completa de Alunos, Professores e Pessoal (CRUD)', done: true },
      { name: 'Gestão de Turmas, Disciplinas e Plano Curricular', done: true },
      { name: 'Sistema Financeiro Completo (Transações, Mensalidades, Bolsas)', done: true },
      { name: 'Operações Diárias (Assiduidade, Notas, Calendários)', done: true },
      { name: 'Módulos Administrativos (Comunicação, Relatórios, Biblioteca)', done: true },
      { name: 'Integração com Base de Dados Real (Supabase)', done: true },
      { name: 'Portal do Aluno e Encarregado', done: true },
    ]
  },
  {
    title: 'Fase 1.1: Aprimoramentos e Adaptação Local',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Adicionar campo NUIT nos cadastros de Alunos e Pessoal', done: true },
      { name: 'Adicionar Ficha de Saúde Básica no cadastro de Alunos', done: true },
      { name: 'Capturar foto do aluno via webcam/telemóvel no cadastro', done: true },
      { name: 'Permitir registo de pagamentos em dinheiro físico (Tesouraria)', done: true },
      { name: "Implementar 'Caixa Diário' para controlo de entradas/saídas em dinheiro", done: true },
      { name: 'Adicionar campo de "Observações Qualitativas" no lançamento de notas', done: true },
      { name: 'Implementar lógica de desconto automático para irmãos', done: true },
      { name: 'Adicionar assinatura digital nos boletins', done: true },
    ]
  },
  {
    title: 'Fase 1.2: Funcionalidades para Professores',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Módulo de Plano de Aula (Criar, editar e consultar) com Assistente de IA', done: true },
      { name: 'Calendário Pessoal do Professor (Visão própria no calendário)', done: true },
    ]
  },
  {
    title: 'Fase 1.3: Administração e Configuração do Sistema',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Módulo de Gestão de Utilizadores (CRUD de contas e perfis)', done: true },
      { name: 'Módulo de Configurações do Sistema (Dados da escola, ano letivo, etc.)', done: true },
      { name: 'Reset de senhas de utilizadores pelo Administrador', done: true },
    ]
  },
  {
    title: 'Fase 1.4: Expansão de Módulos',
    status: 'Concluído',
    variant: 'success' as const,
    features: [
      { name: 'Módulo de Gestão de Saúde Simplificada (Ocorrências)', done: true },
      { name: "Evoluir módulo de Comunicação para um 'Mural Digital' mais robusto", done: true },
    ]
  },
  {
    title: 'MVP 2: Futuras Evoluções',
    status: 'A Fazer',
    variant: 'warning' as const,
    features: [
      { name: 'Implementar arquitetura Offline-First para resiliência de conexão', done: false },
      { name: 'Integração com pagamentos móveis (M-Pesa, e-Mola)', done: false },
      { name: 'Envio de alertas e notificações por SMS', done: false },
      { name: 'Relatórios académicos preditivos (Risco de evasão, etc.)', done: false },
      { name: 'Aplicação móvel dedicada (PWA ou Nativa)', done: false },
    ]
  },
];

const FeatureItem: React.FC<{ done: boolean; children: React.ReactNode }> = ({ children, done }) => (
  <li className="flex items-center space-x-3 py-1">
    <input
      type="checkbox"
      checked={done}
      readOnly
      className="form-checkbox h-5 w-5 text-reviva-green rounded focus:ring-reviva-green-light cursor-pointer"
      aria-label={done ? 'Completo' : 'A fazer'}
    />
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