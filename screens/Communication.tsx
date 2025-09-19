
import React, { useState } from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ANNOUNCEMENTS_DATA, CLASSES_DATA } from '../constants';
import { Announcement } from '../types';
import { Badge } from '../components/ui/Badge';

const Communication: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [target, setTarget] = useState('Todos');

    const handleSave = () => {
        const newAnnouncement: Announcement = {
            id: Date.now(),
            title,
            content,
            target,
            date: new Date().toISOString(),
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setTitle('');
        setContent('');
        setTarget('Todos');
    };
    
    return (
        <>
            <PageHeader title="Comunicação" subtitle="Envie avisos e mensagens para a comunidade escolar">
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Criar Aviso
                </Button>
            </PageHeader>
            
            <div className="space-y-6">
                {announcements.map(announcement => (
                    <Card key={announcement.id}>
                        <div className="p-5">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{announcement.title}</h3>
                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                    <Badge>Para: {announcement.target}</Badge>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(announcement.date).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{announcement.content}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Criar Novo Aviso"
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <Input id="title" label="Título do Aviso" value={title} onChange={e => setTitle(e.target.value)} required />
                    <Select id="target" label="Destinatário" value={target} onChange={e => setTarget(e.target.value)}>
                        <option value="Todos">Todos</option>
                        <option value="Pais">Pais e Encarregados</option>
                        <option value="Professores">Professores</option>
                        <optgroup label="Turmas Específicas">
                            {CLASSES_DATA.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </optgroup>
                    </Select>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mensagem</label>
                        <textarea
                            id="content"
                            rows={5}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Enviar Aviso</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Communication;
