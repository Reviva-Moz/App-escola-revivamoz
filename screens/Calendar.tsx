

import React, { useState, useMemo, FC } from 'react';
import { CalendarEvent } from '../types';
import { CALENDAR_EVENTS_DATA } from '../constants';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Select } from '../components/ui/Select';

const eventTypeClasses: { [key in CalendarEvent['type']]: string } = {
    Feriado: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-300 dark:border-red-500/50',
    Evento: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/50',
    Prova: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500/50',
    Prazo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/50',
};

const eventTypeDotClasses: { [key in CalendarEvent['type']]: string } = {
    Feriado: 'bg-red-500',
    Evento: 'bg-blue-500',
    Prova: 'bg-yellow-500',
    Prazo: 'bg-indigo-500',
};


const EventModal: FC<{
    event: Partial<CalendarEvent> | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id' | 'createdAt'> & { id?: number }) => void;
    onDelete: (id: number) => void;
}> = ({ event, isOpen, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<CalendarEvent['type']>('Evento');
    const [description, setDescription] = useState('');

    React.useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setDate(event.date || new Date().toISOString().split('T')[0]);
            setType(event.type || 'Evento');
            setDescription(event.description || '');
        } else {
            // Reset for new event
            setTitle('');
            setDate(new Date().toISOString().split('T')[0]);
            setType('Evento');
            setDescription('');
        }
    }, [event, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: event?.id, title, date, type, description });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <Card className="w-full max-w-lg relative">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-reviva-green dark:text-reviva-green-light">{event?.id ? 'Editar Evento' : 'Adicionar Evento'}</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar modal">
                            <XMarkIcon className="h-6 w-6" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input id="title" label="Título do Evento" value={title} onChange={e => setTitle(e.target.value)} required />
                        <Input id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        <Select id="type" label="Tipo de Evento" value={type} onChange={e => setType(e.target.value as CalendarEvent['type'])}>
                            <option value="Evento">Evento Escolar</option>
                            <option value="Feriado">Feriado</option>
                            <option value="Prova">Prova / Avaliação</option>
                            <option value="Prazo">Prazo Importante</option>
                        </Select>
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
                            <Button type="submit">{event?.id ? 'Salvar Alterações' : 'Criar Evento'}</Button>
                           </div>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};


const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | null>(null);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const daysInMonth = useMemo(() => {
        const days = [];
        const startDate = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday...
        const totalDays = lastDayOfMonth.getDate();
        
        for (let i = 0; i < startDate; i++) {
            days.push(null);
        }

        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }

        return days;
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

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

    const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt'> & { id?: number }) => {
        if (eventData.id) {
            // Edit existing event
            setEvents(events.map(e => e.id === eventData.id ? { ...e, ...eventData } : e));
        } else {
            // Add new event
            const newEvent: CalendarEvent = {
                ...eventData,
                id: Math.max(0, ...events.map(e => e.id)) + 1, // simple ID generation
                createdAt: new Date().toISOString(),
            };
            setEvents([...events, newEvent]);
        }
        handleCloseModal();
    };

    const handleDeleteEvent = (id: number) => {
        if (window.confirm("Tem a certeza que deseja remover este evento?")) {
            setEvents(events.filter(e => e.id !== id));
            handleCloseModal();
        }
    };
    
    const eventsThisMonth = events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getFullYear() === currentDate.getFullYear() && eventDate.getMonth() === currentDate.getMonth();
    }).sort((a,b) => new Date(a.date).getDate() - new Date(b.date).getDate());


    return (
        <>
            <PageHeader title="Calendário Escolar" subtitle="Organize eventos, feriados e prazos importantes">
                <Button onClick={handleAddEvent}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Adicionar Evento
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
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
                             const dayEvents = day ? events.filter(e => e.date === day.toISOString().split('T')[0]) : [];

                            return (
                                <div key={index} className="h-24 sm:h-28 border-r border-b border-slate-200 dark:border-slate-700 p-1 flex flex-col overflow-hidden">
                                     {day ? (
                                        <>
                                            <span className={`text-sm font-medium ${isToday ? 'bg-reviva-green text-white rounded-full h-6 w-6 flex items-center justify-center' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {day.getDate()}
                                            </span>
                                            <div className="mt-1 space-y-1 overflow-y-auto text-slate-700 dark:text-slate-300">
                                                {dayEvents.map(event => (
                                                    <button key={event.id} onClick={() => handleEditEvent(event)} className="w-full text-left hover:opacity-75">
                                                        <div className="flex items-center text-xs">
                                                            <span className={`w-2 h-2 rounded-full mr-1.5 flex-shrink-0 ${eventTypeDotClasses[event.type]}`}></span>
                                                            <span className="truncate">{event.title}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            )
                        })}
                    </div>
                </Card>

                <Card>
                     <div className="p-4 border-b dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Eventos em {currentDate.toLocaleString('pt-MZ', { month: 'long' })}</h3>
                     </div>
                     <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                        {eventsThisMonth.length > 0 ? eventsThisMonth.map(event => (
                            <div key={event.id} className={`p-3 rounded-lg border-l-4 ${eventTypeClasses[event.type]}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">{new Date(event.date).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' })} - {event.title}</p>
                                        <p className="text-sm opacity-80">{event.description}</p>
                                        <Badge variant="default" className="mt-2">{event.type}</Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)} className="flex-shrink-0 ml-2 -mt-1 -mr-1 opacity-70 hover:opacity-100">
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )) : <p className="text-slate-500 dark:text-slate-400 text-center py-4">Nenhum evento para este mês.</p>}
                     </div>
                </Card>
            </div>
            
            <EventModal 
                isOpen={isModalOpen}
                event={selectedEvent}
                onClose={handleCloseModal}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
            />
        </>
    );
};

export default Calendar;