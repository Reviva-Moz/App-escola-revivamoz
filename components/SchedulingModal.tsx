

import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Tuition, MessageTemplate } from '../types';
import { formatCurrency } from '@/utils/formatters';

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (data: { date: string, time: string, channel: 'whatsapp' | 'sms' }) => void;
    tuition: Tuition | null;
    templates: MessageTemplate[];
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose, onSchedule, tuition, templates }) => {
    const now = new Date();
    const [date, setDate] = useState(now.toISOString().split('T')[0]);
    const [time, setTime] = useState(now.toTimeString().substring(0, 5));
    const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
    const [messagePreview, setMessagePreview] = useState('');

    const fillTemplate = (templateContent: string) => {
        if (!tuition) return templateContent;
        return templateContent
            .replace('{aluno}', tuition.studentName)
            .replace('{mes}', tuition.month)
            .replace('{valor}', formatCurrency(tuition.amount));
    };

    useEffect(() => {
        if (tuition) {
            const defaultTemplate = templates.find(t => t.shortcut === '/lembrete1');
            setMessagePreview(defaultTemplate ? fillTemplate(defaultTemplate.content) : 'Selecione um modelo para ver a pré-visualização.');
        }
    }, [tuition, templates, isOpen]);
    
    if (!isOpen || !tuition) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSchedule({ date, time, channel });
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = parseInt(e.target.value);
        const selectedTemplate = templates.find(t => t.id === templateId);
        if (selectedTemplate) {
            setMessagePreview(fillTemplate(selectedTemplate.content));
        } else {
            setMessagePreview('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Agendar Lembrete para ${tuition.studentName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="schedule-date" label="Data de Envio" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    <Input id="schedule-time" label="Hora de Envio" type="time" value={time} onChange={e => setTime(e.target.value)} required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Canal de Envio</label>
                    <div className="flex gap-4 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="channel" value="whatsapp" checked={channel === 'whatsapp'} onChange={() => setChannel('whatsapp')} className="form-radio h-4 w-4 text-reviva-green" /><span>WhatsApp</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="channel" value="sms" checked={channel === 'sms'} onChange={() => setChannel('sms')} className="form-radio h-4 w-4 text-reviva-green" /><span>SMS</span></label>
                    </div>
                </div>
                <Select id="template-select-schedule" label="Usar Modelo de Mensagem" onChange={handleTemplateChange} required>
                    <option value="">Selecione um modelo...</option>
                    {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </Select>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pré-visualização da Mensagem</label>
                    <div className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[100px] text-sm">
                        {messagePreview || <span className="text-slate-400">A pré-visualização aparecerá aqui...</span>}
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Agendar Envio</Button>
                </div>
            </form>
        </Modal>
    );
};

export default SchedulingModal;