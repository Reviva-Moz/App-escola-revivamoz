

import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Tuition, MessageTemplate } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Select } from './ui/Select';

interface SendReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (channel: 'whatsapp' | 'sms', message: string) => void;
    tuition: Tuition | null;
    channel: 'whatsapp' | 'sms';
    templates: MessageTemplate[];
}

const SendReminderModal: React.FC<SendReminderModalProps> = ({ isOpen, onClose, onSend, tuition, channel, templates }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

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
            const initialMessage = defaultTemplate ? fillTemplate(defaultTemplate.content) : '';
            setMessage(initialMessage);
        }
    }, [tuition, templates, isOpen]);

    if (!isOpen || !tuition) return null;

    const handleSend = () => {
        setIsSending(true);
        // Simulating API call
        setTimeout(() => {
            console.log(`Sending ${channel} message: ${message}`);
            setIsSending(false);
            onSend(channel, message);
        }, 1500);
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = parseInt(e.target.value);
        const selectedTemplate = templates.find(t => t.id === templateId);
        if (selectedTemplate) {
            setMessage(fillTemplate(selectedTemplate.content));
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Enviar Lembrete para ${tuition.studentName}`}>
            <div className="space-y-4">
                 <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                    Ao confirmar, um lembrete de cobrança será <strong>enviado automaticamente</strong> para o encarregado via <strong>{channel.toUpperCase()}</strong>. Pode editar a mensagem abaixo antes de enviar.
                </p>
                <Select id="template-select" label="Usar Modelo de Mensagem" onChange={handleTemplateChange}>
                    <option value="">Selecione um modelo...</option>
                    {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.shortcut})</option>
                    ))}
                </Select>
                 <div>
                    <label htmlFor="message-template" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mensagem Final</label>
                    <textarea
                        id="message-template"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light"
                    />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSending}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSend} disabled={isSending}>
                        {isSending ? 'A Enviar...' : 'Confirmar e Enviar Automaticamente'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SendReminderModal;