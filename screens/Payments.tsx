
import React, { useState, useMemo } from 'react';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { TUITION_DATA } from '../constants';
import { Tuition } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

// Simple SVG logos for payment providers
const MPesaLogo = () => (
    <svg viewBox="0 0 100 40" className="h-8">
        <rect width="100" height="40" rx="5" fill="#ed1c24"/>
        <text x="50" y="26" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle">M-Pesa</text>
    </svg>
);

const EMolaLogo = () => (
    <svg viewBox="0 0 100 40" className="h-8">
        <rect width="100" height="40" rx="5" fill="#ffcb05"/>
        <text x="50" y="26" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#0062a8" textAnchor="middle">e-Mola</text>
    </svg>
);


const Payments: React.FC = () => {
    const [tuitionData, setTuitionData] = useState<Tuition[]>(TUITION_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTuition, setSelectedTuition] = useState<Tuition | null>(null);
    const [paymentStep, setPaymentStep] = useState<'select' | 'phone' | 'processing' | 'success'>('select');
    const [phoneNumber, setPhoneNumber] = useState('');

    const pendingTuitions = useMemo(() => 
        tuitionData.filter(t => t.status === 'Pendente' || t.status === 'Atrasado'),
    [tuitionData]);

    const handleOpenPaymentModal = (tuition: Tuition) => {
        setSelectedTuition(tuition);
        setPaymentStep('select');
        setPhoneNumber('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTuition(null);
    };

    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentStep('processing');
        // Simulate API call
        setTimeout(() => {
            setPaymentStep('success');
            if (selectedTuition) {
                setTuitionData(prevData =>
                    prevData.map(t =>
                        t.id === selectedTuition.id ? { ...t, status: 'Pago' } : t
                    )
                );
            }
        }, 3000); // 3-second delay for simulation
    };
    
    const getStatusBadge = (status: 'Pago' | 'Pendente' | 'Atrasado') => {
        switch (status) {
            case 'Pago': return <Badge variant="success">Pago</Badge>;
            case 'Pendente': return <Badge variant="warning">Pendente</Badge>;
            case 'Atrasado': return <Badge variant="destructive">Atrasado</Badge>;
        }
    };

    const tuitionRows = pendingTuitions.map((tuition) => [
        <span className="font-medium text-gray-900 dark:text-gray-200">{tuition.studentName}</span>,
        tuition.month,
        tuition.dueDate,
        formatCurrency(tuition.amount),
        getStatusBadge(tuition.status),
        <Button onClick={() => handleOpenPaymentModal(tuition)}>
            Pagar Agora
        </Button>
    ]);

    const renderModalContent = () => {
        switch(paymentStep) {
            case 'select':
                return (
                    <div className="text-center">
                        <p className="mb-4 text-slate-600 dark:text-slate-300">Selecione o método de pagamento para a mensalidade de {selectedTuition?.month} no valor de <span className="font-bold">{formatCurrency(selectedTuition?.amount || 0)}</span>.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button variant="secondary" className="p-4 h-auto flex-1" onClick={() => setPaymentStep('phone')}>
                                <MPesaLogo />
                            </Button>
                             <Button variant="secondary" className="p-4 h-auto flex-1" onClick={() => setPaymentStep('phone')}>
                                <EMolaLogo />
                            </Button>
                        </div>
                    </div>
                );
            case 'phone':
                return (
                    <form onSubmit={handleConfirmPayment}>
                        <p className="mb-4 text-slate-600 dark:text-slate-300">Insira o número de telemóvel para receber a notificação de pagamento.</p>
                        <Input 
                            id="phone-number"
                            label="Número de Telemóvel"
                            type="tel"
                            placeholder="84 123 4567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <div className="flex justify-end gap-4 pt-6">
                            <Button type="button" variant="secondary" onClick={() => setPaymentStep('select')}>Voltar</Button>
                            <Button type="submit">Confirmar Pagamento</Button>
                        </div>
                    </form>
                );
            case 'processing':
                return (
                    <div className="text-center p-8">
                        <ClockIcon className="h-16 w-16 text-reviva-green mx-auto animate-spin mb-4" />
                        <h3 className="text-xl font-bold">A processar o pagamento...</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Por favor, aprove a transação no seu telemóvel.</p>
                    </div>
                );
            case 'success':
                 return (
                    <div className="text-center p-8">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Pagamento Concluído!</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">A mensalidade foi paga com sucesso. Obrigado!</p>
                         <div className="mt-6">
                            <Button onClick={handleCloseModal}>Fechar</Button>
                         </div>
                    </div>
                );
        }
    }

    return (
        <>
            <PageHeader title="Pagamentos Online" subtitle="Efetue o pagamento de mensalidades de forma segura e rápida" />

            <DataTable
                title="Mensalidades Pendentes"
                headers={['Aluno', 'Mês', 'Vencimento', 'Valor', 'Status', 'Ações']}
                rows={tuitionRows}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={paymentStep !== 'processing' ? handleCloseModal : () => {}}
                title={paymentStep === 'success' || paymentStep === 'processing' ? "Status do Pagamento" : "Iniciar Pagamento"}
            >
                {renderModalContent()}
            </Modal>
        </>
    );
};

export default Payments;
