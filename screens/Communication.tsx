

import React, { useState, useMemo } from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PlusIcon, PaperClipIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Announcement, AnnouncementCategory } from '../types';
import { Badge } from '../components/ui/Badge';
import { TagIcon } from '../components/icons';
import { useData } from '../context/DataContext';

const Communication: React.FC = () => {
    const { announcements, classes } = useData(); // TODO: Add save function
    const [localAnnouncements, setLocalAnnouncements] = useState<Announcement[]>(announcements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<AnnouncementCategory | 'Todos'>('Todos');
    
    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [target, setTarget] = useState('Todos');
    const [category, setCategory] = useState<AnnouncementCategory>('Informativo');
    const [attachments, setAttachments] = useState('');

    const filteredAnnouncements = useMemo(() => {
        if (filter === 'Todos') {
            return localAnnouncements;
        }
        return localAnnouncements.filter(a => a.category === filter);
    }, [localAnnouncements, filter]);

    const handleSave = () => {
        const attachmentArray = attachments.split(',').map(name => ({ name: name.trim() })).filter(att => att.name);

        const newAnnouncement: Announcement = {
            id: Date.now(),
            title,
            content,
            target,
            category,
            date: new Date().toISOString(),
            attachments: attachmentArray.length > 0 ? attachmentArray : undefined,
            readBy: [],
        };
        setLocalAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setTitle('');
        setContent('');
        setTarget('Todos');
        setCategory('Informativo');
        setAttachments('');
    };
    
    const categoryBadgeVariant = (cat: AnnouncementCategory) => {
        switch(cat) {
            case 'Urgente': return 'destructive' as const;
            case 'Evento': return 'warning' as const;
            case 'Informativo': return 'default' as const;
        }
    }

    return (
        <>
            <PageHeader title="Mural Digital" subtitle="Envie avisos e mensagens para a comunidade escolar">
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Criar Aviso
                </Button>
            </PageHeader>

            <Card className="mb-6 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold mr-2">Filtrar por:</span>
                    {(['Todos', 'Informativo', 'Urgente', 'Evento'] as const).map(cat => (
                        <Button 
                            key={cat}
                            variant={filter === cat ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter(cat === 'Todos' ? 'Todos' : cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </Card>
            
            <div className="space-y-6">
                {filteredAnnouncements.map(announcement => (
                    <Card key={announcement.id}>
                         <div className="p-5">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{announcement.title}</h3>
                                <div className="flex-shrink-0 mt-2 sm:mt-0 text-sm text-slate-500 dark:text-slate-400">
                                    {new Date(announcement.date).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap mb-4">{announcement.content}</p>

                             {announcement.attachments && announcement.attachments.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-sm mb-1">Anexos:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {announcement.attachments.map(att => (
                                            <a href="#" key={att.name} className="flex items-center gap-2 text-sm bg-slate-100 dark:bg-slate-700 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                                                <PaperClipIcon className="h-4 w-4"/>
                                                <span>{att.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                             <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                               <div className="flex gap-2">
                                <Badge>Para: {announcement.target}</Badge>
                                <Badge variant={categoryBadgeVariant(announcement.category)}>
                                    <TagIcon className="h-3 w-3 mr-1 inline"/>
                                    {announcement.category}
                                </Badge>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-2 sm:mt-0">
                                   <EyeIcon className="h-4 w-4"/>
                                   <span>Visto por {announcement.readBy?.length || 0} pessoas</span>
                                    <Button variant="link" size="sm" className="p-0 h-auto">Marcar como lido</Button>
                               </div>
                            </div>
                        </div>
                    </Card>
                ))}
                 {filteredAnnouncements.length === 0 && (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                        <p>Nenhum aviso encontrado para a categoria "<strong>{filter}</strong>".</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Criar Novo Aviso"
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <Input id="title" label="Título do Aviso" value={title} onChange={e => setTitle(e.target.value)} required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select id="target" label="Destinatário" value={target} onChange={e => setTarget(e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="Pais">Pais e Encarregados</option>
                            <option value="Professores">Professores</option>
                            <optgroup label="Turmas Específicas">
                                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </optgroup>
                        </Select>
                        <Select id="category" label="Tipo de Aviso" value={category} onChange={e => setCategory(e.target.value as AnnouncementCategory)}>
                            <option value="Informativo">Informativo</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Evento">Evento</option>
                        </Select>
                    </div>
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
                     <Input id="attachments" label="Anexos (separados por vírgula)" placeholder="ex: documento.pdf, imagem.png" value={attachments} onChange={e => setAttachments(e.target.value)} />

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