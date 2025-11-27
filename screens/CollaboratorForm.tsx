

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useCoreData } from '@/context/CoreDataContext';
import { Staff, Document } from '@/types';
import WebcamCapture from '@/components/WebcamCapture';
import FileUpload from '@/components/ui/FileUpload';

const CollaboratorForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { staff, addStaff, updateStaff } = useCoreData();
    const isEditing = Boolean(id);

    const [formState, setFormState] = useState<Omit<Staff, 'id'>>({
        name: '',
        role: '',
        department: 'Académico',
        email: '',
        phone: '',
        status: 'Ativo',
        nuit: '',
        photoUrl: '',
        documents: [],
    });
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if(isEditing && id) {
            const staffMember = staff.find(s => s.id === parseInt(id));
            if(staffMember) {
                setFormState({ documents: [], ...staffMember });
            }
        }
    }, [id, isEditing, staff]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoCapture = (imageDataUrl: string) => {
        setFormState(prev => ({ ...prev, photoUrl: imageDataUrl }));
    };
    
    const handleFileUpload = (files: File[]) => {
        const newDocuments: Document[] = files.map(file => ({
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
        }));
        setFormState(prev => ({ ...prev, documents: [...(prev.documents || []), ...newDocuments]}));
    };

    const removeDocument = (docToRemove: Document) => {
        setFormState(prev => ({ ...prev, documents: prev.documents?.filter(doc => doc.name !== docToRemove.name)}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const emailExists = staff.some(
            staffMember =>
                staffMember.email.toLowerCase() === formState.email.toLowerCase() &&
                (!id || staffMember.id !== parseInt(id))
        );

        if (emailExists) {
            setError('Este email já está a ser utilizado por outro colaborador.');
            return;
        }

        if (isEditing && id) {
            updateStaff({ id: parseInt(id), ...formState });
        } else {
            addStaff(formState);
        }
        navigate('/colaboradores');
    };
    
    const title = isEditing ? 'Editar Colaborador' : 'Adicionar Novo Colaborador';
    const subtitle = isEditing ? 'Atualize as informações do colaborador' : 'Preencha os dados para criar um novo registo';

    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/colaboradores')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Nome Completo" id="name" name="name" value={formState.name} onChange={handleChange} required />
                                <Input label="Cargo" id="role" name="role" value={formState.role} onChange={handleChange} required placeholder="Ex: Professor, Secretária"/>
                                <Select label="Departamento" id="department" name="department" value={formState.department} onChange={handleChange} required>
                                    <option>Académico</option>
                                    <option>Administrativo</option>
                                    <option>Financeiro</option>
                                    <option>Operações</option>
                                </Select>
                                <Input label="Email" id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
                                <Input label="Contacto Telefónico" id="phone" name="phone" type="tel" value={formState.phone} onChange={handleChange} required />
                                <Input label="NUIT" id="nuit" name="nuit" value={formState.nuit || ''} onChange={handleChange} placeholder="Opcional" />
                                <Select label="Status" id="status" name="status" value={formState.status} onChange={handleChange}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </Select>
                            </div>
                        </Card>
                         <Card className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">Documentos</h3>
                            <FileUpload onFileUpload={handleFileUpload} multiple={true} />
                            {formState.documents && formState.documents.length > 0 && (
                                <ul className="mt-4 space-y-2">
                                    {formState.documents.map(doc => (
                                        <li key={doc.name} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{doc.name}</a>
                                            <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeDocument(doc)}>Remover</Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>
                    <div>
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">Fotografia</h3>
                            <WebcamCapture onCapture={handlePhotoCapture} initialImage={formState.photoUrl} />
                        </Card>
                    </div>
                </div>
                
                {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                
                <div className="flex justify-end mt-8 gap-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/colaboradores')}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        {isEditing ? 'Salvar Alterações' : 'Adicionar Colaborador'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default CollaboratorForm;
