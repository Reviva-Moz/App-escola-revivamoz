import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
    Transaction, Category, Scholarship, PaymentMethod, Tuition, FinancialContextType 
} from '@/types';
import { 
    TRANSACTIONS_DATA, CATEGORIES_DATA, SCHOLARSHIPS_DATA, PAYMENT_METHODS_DATA, TUITION_DATA
} from '@/constants';
import { supabase } from '@/utils/supabase'; // Import Supabase client

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [tuition, setTuition] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data from Supabase on mount
    useEffect(() => {
        const fetchFinancialData = async () => {
            setIsLoading(true);
            try {
                if (!supabase) {
                    console.warn("Supabase not initialized in FinancialContext. Falling back to mock data.");
                    setTransactions(TRANSACTIONS_DATA);
                    setCategories(CATEGORIES_DATA);
                    setScholarships(SCHOLARSHIPS_DATA);
                    setPaymentMethods(PAYMENT_METHODS_DATA);
                    setTuition(TUITION_DATA);
                    return;
                }

                const [
                    { data: tData, error: tError },
                    { data: cData, error: cError },
                    { data: sData, error: sError },
                    { data: pmData, error: pmError },
                    { data: tuData, error: tuError },
                ] = await Promise.all([
                    supabase.from('transactions').select('*'),
                    supabase.from('financial_categories').select('*'),
                    supabase.from('scholarships').select('*'),
                    supabase.from('payment_methods').select('*'),
                    supabase.from('tuition').select('*')
                ]);

                if (tError) console.error("Error fetching transactions:", tError);
                if (tData) {
                    setTransactions(tData.map((t: any) => ({
                        id: t.id,
                        date: t.date,
                        description: t.description,
                        type: t.type,
                        categoryId: t.category_id,
                        amount: t.amount,
                        paymentMethod: t.payment_method
                    })));
                }

                if (cError) console.error("Error fetching categories:", cError);
                if (cData) {
                    setCategories(cData.map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        type: c.type
                    })));
                }

                if (sError) console.error("Error fetching scholarships:", sError);
                if (sData) {
                    setScholarships(sData.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        type: s.type,
                        value: s.value
                    })));
                }

                if (pmError) console.error("Error fetching payment methods:", pmError);
                if (pmData) {
                    setPaymentMethods(pmData.map((pm: any) => ({
                        id: pm.id,
                        name: pm.name,
                        type: pm.type,
                        instructions: pm.instructions,
                        status: pm.status
                    })));
                }

                if (tuError) console.error("Error fetching tuition:", tuError);
                if (tuData) {
                    setTuition(tuData.map((tu: any) => ({
                        id: tu.id,
                        studentId: tu.student_id,
                        studentName: tu.student_name, // Assuming this comes from a join or is denormalized
                        month: tu.month,
                        dueDate: tu.due_date,
                        amount: tu.amount,
                        status: tu.status,
                        reminderScheduledAt: tu.reminder_scheduled_at,
                        reminderType: tu.reminder_type
                    })));
                }

            } catch (err) {
                console.error("Unexpected error fetching financial data:", err);
                // Fallback to mock data on any unexpected error during fetch
                setTransactions(TRANSACTIONS_DATA);
                setCategories(CATEGORIES_DATA);
                setScholarships(SCHOLARSHIPS_DATA);
                setPaymentMethods(PAYMENT_METHODS_DATA);
                setTuition(TUITION_DATA);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFinancialData();
    }, []);

    // --- CRUD Functions ---

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const tempId = Date.now();
        const newTransaction = { ...transaction, id: tempId };
        setTransactions(prev => [...prev, newTransaction]);

        if (supabase) {
            const { data, error } = await supabase.from('transactions').insert({
                date: transaction.date,
                description: transaction.description,
                type: transaction.type,
                category_id: transaction.categoryId,
                amount: transaction.amount,
                payment_method: transaction.paymentMethod
            }).select().single();

            if (error) {
                console.error("Supabase insert error:", error);
                setTransactions(prev => prev.filter(t => t.id !== tempId)); // Revert optimistic update
                alert("Erro ao salvar transação no servidor.");
            } else if (data) {
                setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
            }
        }
    };

    const updateTransaction = async (updatedTransaction: Transaction) => {
        const originalTransactions = transactions;
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));

        if (supabase) {
            const { error } = await supabase.from('transactions').update({
                date: updatedTransaction.date,
                description: updatedTransaction.description,
                type: updatedTransaction.type,
                category_id: updatedTransaction.categoryId,
                amount: updatedTransaction.amount,
                payment_method: updatedTransaction.paymentMethod
            }).eq('id', updatedTransaction.id);

            if (error) {
                console.error("Supabase update error:", error);
                setTransactions(originalTransactions); // Revert optimistic update
                alert("Erro ao atualizar transação no servidor.");
            }
        }
    };

    const deleteTransaction = async (id: number) => {
        const originalTransactions = transactions;
        setTransactions(prev => prev.filter(t => t.id !== id));

        if (supabase) {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) {
                console.error("Supabase delete error:", error);
                setTransactions(originalTransactions); // Revert optimistic update
                alert("Erro ao remover transação do servidor.");
            }
        }
    };

    const addCategory = async (category: Omit<Category, 'id'>) => {
        const tempId = Date.now();
        const newCategory = { ...category, id: tempId };
        setCategories(prev => [...prev, newCategory]);

        if (supabase) {
            const { data, error } = await supabase.from('financial_categories').insert(category).select().single();
            if (error) {
                console.error("Supabase insert error:", error);
                setCategories(prev => prev.filter(c => c.id !== tempId));
                alert("Erro ao salvar categoria no servidor.");
            } else if (data) {
                setCategories(prev => prev.map(c => c.id === tempId ? { ...c, id: data.id } : c));
            }
        }
    };

    const updateCategory = async (updatedCategory: Category) => {
        const originalCategories = categories;
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));

        if (supabase) {
            const { error } = await supabase.from('financial_categories').update(updatedCategory).eq('id', updatedCategory.id);
            if (error) {
                console.error("Supabase update error:", error);
                setCategories(originalCategories);
                alert("Erro ao atualizar categoria no servidor.");
            }
        }
    };

    const deleteCategory = async (id: number) => {
        const originalCategories = categories;
        setCategories(prev => prev.filter(c => c.id !== id));

        if (supabase) {
            const { error } = await supabase.from('financial_categories').delete().eq('id', id);
            if (error) {
                console.error("Supabase delete error:", error);
                setCategories(originalCategories);
                alert("Erro ao remover categoria do servidor.");
            }
        }
    };

    const addScholarship = async (scholarship: Omit<Scholarship, 'id'>) => {
        const tempId = Date.now();
        const newScholarship = { ...scholarship, id: tempId };
        setScholarships(prev => [...prev, newScholarship]);

        if (supabase) {
            const { data, error } = await supabase.from('scholarships').insert(scholarship).select().single();
            if (error) {
                console.error("Supabase insert error:", error);
                setScholarships(prev => prev.filter(s => s.id !== tempId));
                alert("Erro ao salvar bolsa no servidor.");
            } else if (data) {
                setScholarships(prev => prev.map(s => s.id === tempId ? { ...s, id: data.id } : s));
            }
        }
    };

    const updateScholarship = async (updatedScholarship: Scholarship) => {
        const originalScholarships = scholarships;
        setScholarships(prev => prev.map(s => s.id === updatedScholarship.id ? updatedScholarship : s));

        if (supabase) {
            const { error } = await supabase.from('scholarships').update(updatedScholarship).eq('id', updatedScholarship.id);
            if (error) {
                console.error("Supabase update error:", error);
                setScholarships(originalScholarships);
                alert("Erro ao atualizar bolsa no servidor.");
            }
        }
    };

    const deleteScholarship = async (id: number) => {
        const originalScholarships = scholarships;
        setScholarships(prev => prev.filter(s => s.id !== id));

        if (supabase) {
            const { error } = await supabase.from('scholarships').delete().eq('id', id);
            if (error) {
                console.error("Supabase delete error:", error);
                setScholarships(originalScholarships);
                alert("Erro ao remover bolsa do servidor.");
            }
        }
    };
    
    const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
        const tempId = Date.now();
        const newMethod = { ...method, id: tempId };
        setPaymentMethods(prev => [...prev, newMethod]);

        if (supabase) {
            const { data, error } = await supabase.from('payment_methods').insert(method).select().single();
            if (error) {
                console.error("Supabase insert error:", error);
                setPaymentMethods(prev => prev.filter(m => m.id !== tempId));
                alert("Erro ao salvar método de pagamento no servidor.");
            } else if (data) {
                setPaymentMethods(prev => prev.map(m => m.id === tempId ? { ...m, id: data.id } : m));
            }
        }
    };

    const updatePaymentMethod = async (updatedMethod: PaymentMethod) => {
        const originalPaymentMethods = paymentMethods;
        setPaymentMethods(prev => prev.map(m => m.id === updatedMethod.id ? updatedMethod : m));

        if (supabase) {
            const { error } = await supabase.from('payment_methods').update(updatedMethod).eq('id', updatedMethod.id);
            if (error) {
                console.error("Supabase update error:", error);
                setPaymentMethods(originalPaymentMethods);
                alert("Erro ao atualizar método de pagamento no servidor.");
            }
        }
    };

    const deletePaymentMethod = async (id: number) => {
        const originalPaymentMethods = paymentMethods;
        setPaymentMethods(prev => prev.filter(m => m.id !== id));

        if (supabase) {
            const { error } = await supabase.from('payment_methods').delete().eq('id', id);
            if (error) {
                console.error("Supabase delete error:", error);
                setPaymentMethods(originalPaymentMethods);
                alert("Erro ao remover método de pagamento do servidor.");
            }
        }
    };

    const value: FinancialContextType = {
        transactions, categories, scholarships, paymentMethods, tuition,
        addTransaction, updateTransaction, deleteTransaction,
        addCategory, updateCategory, deleteCategory,
        addScholarship, updateScholarship, deleteScholarship,
        addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
    };

    return (
        <FinancialContext.Provider value={value}>
            {children}
        </FinancialContext.Provider>
    );
};

export const useFinancialData = () => {
    const context = useContext(FinancialContext);
    if (context === undefined) {
        throw new Error('useFinancialData must be used within a FinancialProvider');
    }
    return context;
};