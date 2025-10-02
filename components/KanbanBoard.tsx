

import React from 'react';
import { Tuition } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ClockIcon, ChatBubbleLeftEllipsisIcon, DevicePhoneMobileIcon } from './icons';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { BadgeProps } from './ui/Badge';

interface KanbanBoardProps {
  columns: Record<Tuition['status'], Tuition[]>;
  onStatusChange: (tuitionId: number, newStatus: Tuition['status']) => void;
  onSchedule: (tuition: Tuition) => void;
  onSendWhatsApp: (tuition: Tuition) => void;
  onSendSms: (tuition: Tuition) => void;
}

const columnStyles: Record<Tuition['status'], { header: string; bg: string }> = {
    'Pendente': { header: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
    'Atrasado': { header: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
    'Em Cobrança': { header: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    'Pago': { header: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
};

const KanbanCard: React.FC<{ 
    tuition: Tuition; 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    onSchedule: (tuition: Tuition) => void;
    onSendWhatsApp: (tuition: Tuition) => void;
    onSendSms: (tuition: Tuition) => void;
}> = ({ tuition, onDragStart, onSchedule, onSendWhatsApp, onSendSms }) => {
    
    // Helper function to map tuition status to badge variant
    const getStatusBadgeVariant = (status: Tuition['status']): BadgeProps['variant'] => {
        switch (status) {
            case 'Pago': return 'success';
            case 'Pendente': return 'warning';
            case 'Atrasado': return 'destructive';
            case 'Em Cobrança': return 'info';
            default: return 'default';
        }
    };

    return (
        <div
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow cursor-grab active:cursor-grabbing border border-slate-200 dark:border-slate-700"
            draggable
            onDragStart={(e) => onDragStart(e, tuition.id)}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{tuition.studentName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Mês: {tuition.month}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(tuition.status)} className="flex-shrink-0">{tuition.status}</Badge>
            </div>
            
            <div className="flex justify-between items-end">
                 <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Vence em: {tuition.dueDate}</p>
                    <p className="text-lg font-bold text-reviva-green dark:text-reviva-green-light mt-1">{formatCurrency(tuition.amount)}</p>
                </div>
                {tuition.reminderScheduledAt && (
                    <div title={`Agendado para ${new Date(tuition.reminderScheduledAt).toLocaleString('pt-MZ')}`} className="flex items-center text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full flex-shrink-0">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>Agendado</span>
                    </div>
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 flex justify-end items-center gap-1">
                <Button variant="ghost" size="icon" title="Agendar Lembrete" onClick={() => onSchedule(tuition)}>
                    <ClockIcon className="h-5 w-5 text-slate-500" />
                </Button>
                 <Button variant="ghost" size="icon" title="Enviar WhatsApp" onClick={() => onSendWhatsApp(tuition)}>
                    <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-slate-500" />
                </Button>
                 <Button variant="ghost" size="icon" title="Enviar SMS" onClick={() => onSendSms(tuition)}>
                    <DevicePhoneMobileIcon className="h-5 w-5 text-slate-500" />
                </Button>
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{
  title: Tuition['status'];
  tuitions: Tuition[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onSchedule: (tuition: Tuition) => void;
  onSendWhatsApp: (tuition: Tuition) => void;
  onSendSms: (tuition: Tuition) => void;
}> = ({ title, tuitions = [], onDrop, onDragStart, onSchedule, onSendWhatsApp, onSendSms }) => {
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const { header, bg } = columnStyles[title];

    return (
        <div 
            className={`flex-1 min-w-[300px] rounded-lg shadow-sm ${bg}`}
            onDragOver={handleDragOver}
            onDrop={onDrop}
            data-status={title}
        >
            <div className={`p-3 rounded-t-lg text-white font-bold text-lg ${header}`}>
                {title} ({tuitions.length})
            </div>
            <div className="p-3 space-y-3 h-[60vh] overflow-y-auto">
                {tuitions.map(tuition => (
                   <KanbanCard 
                    key={tuition.id}
                    tuition={tuition}
                    onDragStart={onDragStart}
                    onSchedule={onSchedule}
                    onSendSms={onSendSms}
                    onSendWhatsApp={onSendWhatsApp}
                   />
                ))}
            </div>
        </div>
    );
};


const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onStatusChange, onSchedule, onSendSms, onSendWhatsApp }) => {
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.dataTransfer.setData("tuitionId", id.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const tuitionId = parseInt(e.dataTransfer.getData("tuitionId"));
        const newStatus = e.currentTarget.dataset.status as Tuition['status'];
        if (tuitionId && newStatus) {
            onStatusChange(tuitionId, newStatus);
        }
    };
    
    const columnOrder: Tuition['status'][] = ['Pendente', 'Atrasado', 'Em Cobrança', 'Pago'];

    return (
        <div className="flex gap-6 overflow-x-auto pb-4">
            {columnOrder.map(status => (
                <KanbanColumn
                    key={status}
                    title={status}
                    tuitions={columns[status] || []}
                    onDrop={handleDrop}
                    onDragStart={handleDragStart}
                    onSchedule={onSchedule}
                    onSendSms={onSendSms}
                    onSendWhatsApp={onSendWhatsApp}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;