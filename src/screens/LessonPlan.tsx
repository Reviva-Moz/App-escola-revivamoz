import React, { useState, useMemo, FC, useEffect } from 'react';
import PageHeader from '@/components/Header';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SparklesIcon } from '@/components/icons';
import { LessonPlan, Subject, AIConfiguration } from '@/types';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { useAdminData } from '@/context/AdminContext';
import { useCoreData } from '@/context/CoreDataContext';
import { useAcademicData } from '@/context/AcademicContext';
import { useAuth } from '@/context/AuthContext';

const AIAssistantModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: { objectives: string; content: string; resources: string; }) => void;
  subjectName: string;
}> = ({ isOpen, onClose, onApply, subjectName }) => {
    const { aiConfiguration } = useAdminData();
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ objectives: string; content: string; resources: string; } | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Reset form values when modal is opened or config changes
        const initialValues: Record<string, string> = {};
        aiConfiguration.input_fields.forEach(field => {
            initialValues[field.id] = '';
        });
        setFormValues(initialValues);
        setResult(null);
        setError('');
    }, [isOpen, aiConfiguration]);

    const handleInputChange = (id: string, value: string) => {
        setFormValues(prev => ({ ...prev, [id]: value }));
    };

    const generateContent = async () => {
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            if (!process.env.API_KEY) {
              throw new Error("API_KEY is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const userInputs = aiConfiguration.input_fields
                .map(field => `${field.label}: ${formValues[field.id] || 'Não informado'}`)
                .join('\n');
            
            const prompt = `Com base nos princípios e metodologia fornecidos, e com as informações a seguir, gere um plano de aula detalhado para a disciplina de ${subjectName}.\n\nINFORMAÇÕES FORNECIDAS:\n${userInputs}`;

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: `Você é um assistente especialista na criação de planos de aula seguindo a Abordagem Educacional por Princípios (AEP), uma metodologia cristã. Sua base de conhecimento sobre AEP é o texto a seguir: "${aiConfiguration.trainingText}". Ao gerar o plano, estruture a resposta em JSON com as chaves "objectives", "content", e "resources". O conteúdo e as atividades devem refletir os 4 passos do raciocínio da AEP (Pesquisar, Raciocinar, Relacionar, Registrar).`,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            objectives: {
                                type: Type.STRING,
                                description: 'Os objetivos de aprendizagem da aula, listados e formatados com nova linha se necessário.'
                            },
                            content: {
                                type: Type.STRING,
                                description: 'O conteúdo detalhado e as atividades a serem realizadas na aula, bem formatado, com nova linha se necessário e refletindo os 4 passos do raciocínio da AEP.'
                            },
                            resources: {
                                type: Type.STRING,
                                description: 'A lista de recursos e materiais necessários para a aula, listados e formatados com nova linha se necessário.'
                            }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text.trim());
            setResult(data);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setError("Ocorreu um erro ao contactar a IA. Verifique a sua chave de API e a configuração e tente novamente.");
            setResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const isGenerateDisabled = isLoading || Object.values(formValues).every(value => String(value).trim() === '');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assistente de IA para Planos de Aula (AEP)">
            <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">Preencha os campos abaixo para a sua aula de <strong>{subjectName}</strong> e a IA irá gerar sugestões com base na <strong>Abordagem Educacional por Princípios</strong>.</p>
                <div className="space-y-3 p-2">
                    {aiConfiguration.input_fields.map(field => (
                        <div key={field.id}>
                           {field.type === 'textarea' ? (
                                <div>
                                    <label htmlFor={`ai-${field.id}`} className="mb-1 block text-sm font-medium">{field.label}</label>
                                    <textarea
                                        id={`ai-${field.id}`}
                                        rows={2}
                                        placeholder={field.placeholder}
                                        value={formValues[field.id]}
                                        onChange={e => handleInputChange(field.id, e.target.value)}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg"
                                    />
                                </div>
                           ) : (
                                <Input
                                    id={`ai-${field.id}`}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    value={formValues[field.id]}
                                    onChange={e => handleInputChange(field.id, e.target.value)}
                                />
                           )}
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <Button onClick={generateContent} disabled={isGenerateDisabled} className="w-full sm:w-auto">
                        {isLoading ? 'A pensar...' : 'Gerar Ideias'}
                    </Button>
                </div>
                {isLoading && <div className="text-center p-4">A gerar sugestões...</div>}
                {error && <p className="text-red-500 text-sm p-2 text-center">{error}</p>}
                {result && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg max-h-64 overflow-y-auto text-sm">
                        <h4 className="font-semibold mb-1">Objetivos Sugeridos:</h4>
                        <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 mb-3">{result.objectives}</p>
                        <h4 className="font-semibold mb-1">Conteúdo e Atividades Sugeridas:</h4>
                        <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 mb-3">{result.content}</p>
                        <h4 className="font-semibold mb-1">Recursos Sugeridos:</h4>
                        <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{result.resources}</p>
                    </div>
                )}
                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="secondary" onClick={onClose}>Fechar</Button>
                    <Button onClick={() => onApply(result!)} disabled={!result}>Aplicar ao Plano</Button>
                </div>
            </div>
        </Modal>
    );
};


const LessonPlan: React.FC = () => {
  const { user } = useAuth();
  const { classes, subjects, classCurriculum, teachers } = useCoreData();
  const { lessonPlans } = useAcademicData();
  const [plans, setPlans] = useState<LessonPlan[]>(lessonPlans);
  
  // Modal states
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  const loggedInTeacher = useMemo(() => {
    if (user?.role !== 'PROFESSOR') return null;
    return teachers.find(t => t.email.toLowerCase() === user.email.toLowerCase());
  }, [user, teachers]);

  const teacherCurriculum = useMemo(() => {
    if (!loggedInTeacher) return [];
    return classCurriculum.filter(cc => cc.teacherId === loggedInTeacher.id);
  }, [loggedInTeacher, classCurriculum]);

  const classesToDisplay = useMemo(() => {
    if (loggedInTeacher) {
      const teacherClassIds = new Set(teacherCurriculum.map(cc => cc.classId));
      return classes.filter(c => teacherClassIds.has(c.id));
    }
    return classes;
  }, [loggedInTeacher, teacherCurriculum, classes]);
  
  const [selectedClassId, setSelectedClassId] = useState<string>(classesToDisplay[0]?.id.toString() || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  const subjectsForClass = useMemo(() => {
    if (!selectedClassId) return [];
    const curriculumForClass = classCurriculum.filter(c => c.classId === parseInt(selectedClassId));
    
    if (loggedInTeacher) {
        const teacherSubjectIds = teacherCurriculum
            .filter(cc => cc.classId === parseInt(selectedClassId))
            .map(cc => cc.subjectId);
        return subjects.filter(subject => teacherSubjectIds.includes(subject.id));
    }

    return subjects.filter(subject =>
      curriculumForClass.some(c => c.subjectId === subject.id)
    );
  }, [selectedClassId, classCurriculum, subjects, loggedInTeacher, teacherCurriculum]);

  useEffect(() => {
    if (subjectsForClass.length > 0 && !subjectsForClass.some(s => s.id.toString() === selectedSubjectId)) {
        setSelectedSubjectId(subjectsForClass[0].id.toString());
    } else if (subjectsForClass.length === 0) {
        setSelectedSubjectId('');
    }
  }, [selectedClassId, subjectsForClass, selectedSubjectId]);
  
   useEffect(() => {
    if (classesToDisplay.length > 0 && !classesToDisplay.some(c => c.id.toString() === selectedClassId)) {
        setSelectedClassId(classesToDisplay[0].id.toString());
    } else if (classesToDisplay.length === 0) {
        setSelectedClassId('');
    }
  }, [classesToDisplay, selectedClassId]);

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
                    {classesToDisplay.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
            subjects={subjects}
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
    subjects: Subject[];
}> = ({ isOpen, onClose, onSave, plan, classId, subjectId, subjects }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [objectives, setObjectives] = useState('');
    const [content, setContent] = useState('');
    const [resources, setResources] = useState('');
    const [isAIModalOpen, setAIModalOpen] = useState(false);
    
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

    const handleAIApply = (data: { objectives: string; content: string; resources: string; }) => {
        const separator = "\n\n--- SUGESTÃO DA IA ---\n";
        setObjectives(prev => prev ? `${prev}${separator}${data.objectives}` : data.objectives);
        setContent(prev => prev ? `${prev}${separator}${data.content}` : data.content);
        setResources(prev => prev ? `${prev}${separator}${data.resources}` : data.resources);
        setAIModalOpen(false);
    };

    const subjectName = subjects.find(s => s.id === subjectId)?.name || 'a disciplina selecionada';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={plan ? 'Editar Plano de Aula' : 'Criar Plano de Aula'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="title" label="Título da Aula" value={title} onChange={e => setTitle(e.target.value)} required />
                    <Input id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="pt-2 pb-2 text-right">
                    <Button type="button" variant="secondary" onClick={() => setAIModalOpen(true)}>
                        <SparklesIcon className="h-5 w-5 mr-2"/>
                        Usar Assistente de IA
                    </Button>
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
            {isAIModalOpen && (
                <AIAssistantModal
                    isOpen={isAIModalOpen}
                    onClose={() => setAIModalOpen(false)}
                    onApply={handleAIApply}
                    subjectName={subjectName}
                />
            )}
        </Modal>
    );
};


export default LessonPlan;