
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { TrashIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAdminData } from '../context/AdminContext';
import { AIConfiguration, CustomInputField } from '../types';

const AIConfiguration: React.FC = () => {
    const navigate = useNavigate();
    const { aiConfiguration, updateAIConfiguration } = useAdminData();
    const [config, setConfig] = useState<AIConfiguration>(aiConfiguration);

    useEffect(() => {
        setConfig(aiConfiguration);
    }, [aiConfiguration]);

    const handleTrainingTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setConfig(prev => ({ ...prev, trainingText: e.target.value }));
    };

    const handleFieldChange = (index: number, field: keyof CustomInputField, value: string) => {
        const updatedFields = [...config.input_fields];
        updatedFields[index] = { ...updatedFields[index], [field]: value };
        setConfig(prev => ({ ...prev, input_fields: updatedFields }));
    };

    const addField = () => {
        const newField: CustomInputField = {
            id: `field_${Date.now()}`,
            label: '',
            placeholder: '',
            type: 'text',
        };
        setConfig(prev => ({ ...prev, input_fields: [...prev.input_fields, newField] }));
    };

    const removeField = (index: number) => {
        const updatedFields = config.input_fields.filter((_, i) => i !== index);
        setConfig(prev => ({ ...prev, input_fields: updatedFields }));
    };
    
    const handleSave = () => {
        updateAIConfiguration(config);
        alert('Configurações do Assistente de IA salvas com sucesso!');
        navigate('/configuracoes');
    }

    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/configuracoes')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader 
                    title="Configuração do Assistente de IA" 
                    subtitle="Treine o agente de IA e personalize os formulários para os professores"
                />
            </div>

            <div className="space-y-8">
                <Card>
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Treinamento do Agente (RAG)</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Insira aqui os princípios, metodologias e informações sobre a <strong>Abordagem Educacional por Princípios (AEP)</strong>. Este texto servirá como a "memória" do assistente, garantindo que as sugestões estejam alinhadas com a vossa filosofia educacional.
                        </p>
                        <textarea
                            value={config.trainingText}
                            onChange={handleTrainingTextChange}
                            rows={10}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm font-mono"
                        />
                    </div>
                </Card>

                <Card>
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Campos do Formulário para Professores</h3>
                    </div>
                     <div className="p-6">
                         <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Defina os campos que os professores preencherão para solicitar ajuda da IA na criação de um plano de aula.
                        </p>
                        <div className="space-y-4">
                            {config.input_fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-8 gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="md:col-span-3">
                                        <Input id={`label-${index}`} label="Nome do Campo" value={field.label} onChange={(e) => handleFieldChange(index, 'label', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-3">
                                         <Input id={`placeholder-${index}`} label="Placeholder" value={field.placeholder} onChange={(e) => handleFieldChange(index, 'placeholder', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-1">
                                         <Select id={`type-${index}`} label="Tipo" value={field.type} onChange={(e) => handleFieldChange(index, 'type', e.target.value)}>
                                            <option value="text">Texto</option>
                                            <option value="textarea">Área de Texto</option>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-1 flex items-end">
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100" onClick={() => removeField(index)}>
                                            <TrashIcon className="h-5 w-5"/>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button variant="secondary" onClick={addField}>
                                <PlusIcon className="h-4 w-4 mr-2"/>
                                Adicionar Campo
                            </Button>
                        </div>
                    </div>
                </Card>
                
                <div className="flex justify-end gap-4">
                    <Button variant="secondary" onClick={() => navigate('/configuracoes')}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Configurações</Button>
                </div>
            </div>
        </>
    );
};

export default AIConfiguration;
