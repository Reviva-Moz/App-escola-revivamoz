

import React, { useState, useMemo, FC, useEffect } from 'react';
import PageHeader from '../components/Header';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SparklesIcon } from '../components/icons';
import { LessonPlan } from '../types';
import { GoogleGenAI } from "@google/genai";
import { useData } from '../context/DataContext';

// AI Assistant Modal Component defined within the file
const AIAssistantModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (content: string) => void;
  subjectName: string;
}> = ({ isOpen, onClose, onApply, subjectName }) => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const generateContent = async () => {
        if (!topic) return;
        setIsLoading(true);
        setResult('');
        setError('');
        try {
            if (!process.env.API_KEY) {
              throw new Error("API_KEY is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Aja como um assistente pedagógico criativo. Gere ideias para um plano de aula de ${subjectName} sobre o tópico "${topic}". Inclua seções claras para: 1. Objetivos de Aprendizagem. 2. Atividades de Engajamento. 3. Recursos Necessários. Formate a resposta de forma clara e útil.`,
            });
            setResult(response.text);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setError("Ocorreu um erro ao contactar a IA. Verifique a sua chave de API e tente novamente.");
            setResult('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assistente de IA para Planos de Aula">
            <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">Insira um tópico para a sua aula de <strong>{subjectName}</strong> e a IA irá gerar sugestões de objetivos, atividades e recursos.</p>
                <div className="flex gap-2">
                    <Input id="ai-topic" label="Tópico da Aula" placeholder="Ex: Ciclo da Água, Teorema de Pitágoras" value={topic} onChange={e => setTopic(e.target.value)} />
                    <Button onClick={generateContent} disabled={isLoading || !topic}>
                        {isLoading ? 'A pensar...' : 'Gerar Ideias'}
                    </Button>
                </div>
                {isLoading && <div className="text-center p-4">A gerar sugestões...</div>}
                {error && <p className="text-red-500 text-sm p-2">{error}</p>}
                {result && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg max-h-64 overflow-y-auto">
                        <p className="whitespace-pre-wrap font-mono text-sm">{result}</p>
                    </div>
                )}
                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="secondary" onClick={onClose}>Fechar</Button>
                    <Button onClick={() => onApply(result)} disabled={!result}>Aplicar ao Plano</Button>
                </div>
            </div>
        </Modal>
    );
};

const LessonPlan: React.FC = () => {
  const { classes, subjects, classCurriculum, lessonPlans } = useData(); // TODO: Add CRUD functions
  const [plans, setPlans] = useState<LessonPlan[]>(lessonPlans);
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id.toString() || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  
  // Modal states
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  const subjectsForClass = useMemo(() => {
    if (!selectedClassId) return [];
    const curriculumForClass = classCurriculum.filter(c => c.classId === parseInt(selectedClassId));
    return subjects.filter(subject =>
      curriculumForClass.some(c => c.subjectId === subject.id)
    );
  }, [selectedClassId, classCurriculum, subjects]);

  useEffect(() => {
    if (subjectsForClass.length > 0 && !subjectsForClass.some(s => s.id.toString() === selectedSubjectId)) {
        setSelectedSubjectId(subjectsForClass[0].id.toString());
    } else if (subjectsForClass.length === 0) {
        setSelectedSubjectId('');
    }
  }, [selectedClassId, subjectsForClass, selectedSubjectId]);

  const filteredPlans = useMemo(() => {
    if (!selectedClassId || !selectedSubjectId) return [];
    return plans
        .filter(p => p.classId === parseInt(selectedClassId) && p.subjectId === parseInt(selectedSubjectId))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [plans, selectedClassId, selectedSubjectId]);

  const handleOpenPlanModal = (plan: LessonPlan | null) => {
    setEditingPlan(plan);
    setPlanModalOpen(true);
  };
  
  const handleSavePlan = (planData: Omit<LessonPlan, 'id'> & { id?: number }) => {
    if (planData.id) {
        setPlans(plans.map(p => p.id === planData.id ? { ...p, ...planData } : p));
    } else {
        const newPlan = { ...planData, id: Date.now() };
        setPlans([...plans, newPlan]);
    }
    setPlanModalOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este plano de aula?")) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <PageHeader title="Plano de Aula" subtitle="Crie e gira os seus planos de aula por turma e disciplina">
        <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => setAIModalOpen(true)} disabled={!selectedSubjectId}>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Assistente IA
            </Button>
            <Button onClick={() => handleOpenPlanModal(null)} disabled={!selectedClassId || !selectedSubjectId}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Criar Plano de Aula
            </Button>
        </div>
      </PageHeader>
      
      <Card className="mb-6">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <Select label="Turma" id="class-select" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
            </div>
             <div>
                <Select label="Disciplina" id="subject-select" value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} disabled={subjectsForClass.length === 0}>
                    {subjectsForClass.length > 0 ? subjectsForClass.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : <option>Sem disciplinas nesta turma</option>}
                </Select>
            </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        {filteredPlans.length > 0 ? filteredPlans.map(plan => (
            <Card key={plan.id}>
                <div className="p-4">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(plan.date).toLocaleDateString('pt-MZ', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{plan.title}</h3>
                        </div>
                        <div className="flex-shrink-0 flex gap-2">
                             <Button variant="ghost" size="icon" onClick={() => handleOpenPlanModal(plan)}><PencilIcon className="h-5 w-5" /></Button>
                             <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeletePlan(plan.id)}><TrashIcon className="h-5 w-5" /></Button>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div><h4 className="font-semibold mb-1 border-b dark:border-slate-600">Objetivos</h4><p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{plan.objectives}</p></div>
                        <div><h4 className="font-semibold mb-1 border-b dark:border-slate-600">Conteúdo/Atividades</h4><p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{plan.content}</p></div>
                        <div><h4 className="font-semibold mb-1 border-b dark:border-slate-600">Recursos</h4><p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{plan.resources}</p></div>
                    </div>
                </div>
            </Card>
        )) : (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                <p>Nenhum plano de aula encontrado para a seleção atual.</p>
                <p>Crie um novo plano para começar.</p>
            </div>
        )}
      </div>

       {isPlanModalOpen && (
         <LessonPlanForm
            isOpen={isPlanModalOpen}
            onClose={() => setPlanModalOpen(false)}
            onSave={handleSavePlan}
            plan={editingPlan}
            classId={parseInt(selectedClassId)}
            subjectId={parseInt(selectedSubjectId)}
         />
       )}
        {isAIModalOpen && (
            <AIAssistantModal
                isOpen={isAIModalOpen}
                onClose={() => setAIModalOpen(false)}
                onApply={(content) => {
                    alert("Conteúdo copiado! Cole nas seções correspondentes do seu plano de aula.");
                    setAIModalOpen(false);
                }}
                subjectName={subjects.find(s => s.id === parseInt(selectedSubjectId))?.name || 'a disciplina selecionada'}
            />
        )}
    </>
  );
};

// Form component for Lesson Plan
const LessonPlanForm: FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<LessonPlan, 'id'> & { id?: number }) => void;
    plan: LessonPlan | null;
    classId: number;
    subjectId: number;
}> = ({ isOpen, onClose, onSave, plan, classId, subjectId }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [objectives, setObjectives] = useState('');
    const [content, setContent] = useState('');
    const [resources, setResources] = useState('');
    
    useEffect(() => {
        if (plan) {
            setTitle(plan.title);
            setDate(plan.date);
            setObjectives(plan.objectives);
            setContent(plan.content);
            setResources(plan.resources);
        } else {
            setTitle('');
            setDate(new Date().toISOString().split('T')[0]);
            setObjectives('');
            setContent('');
            setResources('');
        }
    }, [plan, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: plan?.id, title, date, objectives, content, resources, classId, subjectId });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={plan ? 'Editar Plano de Aula' : 'Criar Plano de Aula'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="title" label="Título da Aula" value={title} onChange={e => setTitle(e.target.value)} required />
                    <Input id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="objectives" className="mb-1 block text-sm font-medium">Objetivos</label>
                    <textarea id="objectives" rows={3} value={objectives} onChange={e => setObjectives(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg"></textarea>
                </div>
                 <div>
                    <label htmlFor="content" className="mb-1 block text-sm font-medium">Conteúdo / Atividades</label>
                    <textarea id="content" rows={4} value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg"></textarea>
                </div>
                 <div>
                    <label htmlFor="resources" className="mb-1 block text-sm font-medium">Recursos</label>
                    <textarea id="resources" rows={2} value={resources} onChange={e => setResources(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg"></textarea>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </div>
            </form>
        </Modal>
    );
};


export default LessonPlan;