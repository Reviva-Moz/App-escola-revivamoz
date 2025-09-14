

import React, { useState, useMemo, FC, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { CALENDAR_EVENTS_DATA, CLASSES_DATA, SUBJECTS_DATA } from '../constants';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';


const ProvaModal: FC<{
    event: Partial<CalendarEvent> | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'type'> & { id?: number }) => void;
    onDelete: (id: number) => void;
}> = ({ event, isOpen, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [classId, setClassId] = useState<string>('');
    const [subjectId, setSubjectId] = useState<string>('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setDate(event.date || new Date().toISOString().split('T')[0]);
            setClassId(event.classId?.toString() || '');
            setSubjectId(event.subjectId?.toString() || '');
            setDescription(event.description || '');
        }
    }, [event, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: event?.id, title, date, description, classId: parseInt(classId), subjectId: parseInt(subjectId) });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <Card className="w-full max-w-lg relative">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-reviva-green dark:text-reviva-green-light">{event?.id ? 'Editar Prova' : 'Adicionar Prova'}</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar modal">
                            <XMarkIcon className="h-6 w-6" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input id="title" label="Título da Prova" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Prova Final de Ciências" required />
                        <Input id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select id="class" label="Turma" value={classId} onChange={e => setClassId(e.target.value)} required>
                                <option value="">Selecione a turma</option>
                                {CLASSES_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                             <Select id="subject" label="Disciplina" value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
                                <option value="">Selecione a disciplina</option>
                                {SUBJECTS_DATA.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Descrição (Opcional)</label>
                            <textarea id="description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg"></textarea>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                           <div>
                            {event?.id && (
                                <Button type="button" variant="secondary" onClick={() => onDelete(event.id!)} className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50">
                                    <TrashIcon className="h-5 w-5 mr-2" />
                                    Remover
                                </Button>
                             )}
                           </div>
                           <div className="flex gap-4">
                            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">{event?.id ? 'Salvar Alterações' : 'Criar Prova'}</Button>
                           </div>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};


const ProvaCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | null>(null);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const daysInMonth = useMemo(() => {
        const days = [];
        const startDate = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();
        
        for (let i = 0; i < startDate; i++) {
            days.push(null);
        }
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return days;
    }, [currentDate]);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    
    const handleAddEvent = () => {
        setSelectedEvent({ date: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'type'> & { id?: number }) => {
        const fullEventData = { ...eventData, type: 'Prova' as const };
        if (fullEventData.id) {
            setEvents(events.map(e => e.id === fullEventData.id ? { ...e, ...fullEventData } : e));
        } else {
            const newEvent: CalendarEvent = {
                ...fullEventData,
                id: Math.max(0, ...events.map(e => e.id)) + 1,
                createdAt: new Date().toISOString(),
            };
            setEvents([...events, newEvent]);
        }
        handleCloseModal();
    };

    const handleDeleteEvent = (id: number) => {
        if (window.confirm("Tem a certeza que deseja remover esta prova?")) {
            setEvents(events.filter(e => e.id !== id));
            handleCloseModal();
        }
    };
    
    const provas = useMemo(() => events.filter(e => e.type === 'Prova'), [events]);

    return (
        <>
            <PageHeader title="Calendário de Provas" subtitle="Organize e visualize o cronograma de avaliações">
                <Button onClick={handleAddEvent}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Adicionar Prova
                </Button>
            </PageHeader>

            <Card>
                <div className="p-4 flex justify-between items-center border-b dark:border-slate-700">
                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} aria-label="Mês anterior">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        {currentDate.toLocaleString('pt-MZ', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Próximo mês">
                        <ChevronRightIcon className="h-6 w-6" />
                    </Button>
                </div>
                <div className="grid grid-cols-7 text-center font-semibold text-slate-600 dark:text-slate-400 border-b dark:border-slate-700">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="py-2">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {daysInMonth.map((day, index) => {
                         const isToday = day && day.toDateString() === new Date().toDateString();
                         const dayEvents = day ? provas.filter(e => e.date === day.toISOString().split('T')[0]) : [];

                        return (
                            <div key={index} className="h-28 sm:h-32 border-r border-b border-slate-200 dark:border-slate-700 p-1 flex flex-col overflow-hidden">
                                 {day && (
                                    <>
                                        <span className={`text-sm font-medium ${isToday ? 'bg-reviva-green text-white rounded-full h-6 w-6 flex items-center justify-center' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {day.getDate()}
                                        </span>
                                        <div className="mt-1 space-y-1 overflow-y-auto text-slate-700 dark:text-slate-300">
                                            {dayEvents.map(event => (
                                                <button key={event.id} onClick={() => handleEditEvent(event)} className="w-full text-left p-1 rounded-md bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/80">
                                                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 truncate">{event.title}</p>
                                                    <p className="text-xs text-yellow-700 dark:text-yellow-300/80 truncate">{CLASSES_DATA.find(c => c.id === event.classId)?.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Card>
            
            <ProvaModal 
                isOpen={isModalOpen}
                event={selectedEvent}
                onClose={handleCloseModal}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
            />
        </>
    );
};

export default ProvaCalendar;