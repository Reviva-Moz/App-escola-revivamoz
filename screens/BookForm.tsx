import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAdminData } from '@/context/AdminContext';
import { Book } from '@/types';

const BookForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { books, addBook, updateBook } = useAdminData();
    const isEditing = Boolean(id);

    const [formState, setFormState] = useState<Omit<Book, 'id' | 'availableStock'>>({
        title: '',
        author: '',
        isbn: '',
        totalStock: 1,
    });
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isEditing && id) {
            const bookData = books.find(b => b.id === parseInt(id));
            if (bookData) {
                // Exclude availableStock when setting form state for editing
                const { availableStock, ...dataToEdit } = bookData;
                setFormState(dataToEdit);
            }
        }
    }, [id, isEditing, books]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({...prev, [name]: name === 'totalStock' ? parseInt(value) || 1 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isEditing && id) {
            const existingBook = books.find(b => b.id === parseInt(id));
            if (existingBook) {
                const stockDifference = formState.totalStock - existingBook.totalStock;
                const newAvailableStock = existingBook.availableStock + stockDifference;
                
                updateBook({ 
                    ...formState, 
                    id: parseInt(id), 
                    availableStock: Math.max(0, newAvailableStock)
                });
            }
        } else {
            addBook(formState);
        }
        navigate('/biblioteca');
    };

    const title = isEditing ? 'Editar Livro' : 'Adicionar Novo Livro';
    const subtitle = isEditing ? 'Atualize as informações do livro' : 'Preencha os dados para adicionar um novo livro ao catálogo';

    return (
        <>
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/biblioteca')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Input label="Título do Livro" id="title" name="title" value={formState.title} onChange={handleChange} required />
                        </div>
                        <Input label="Autor" id="author" name="author" value={formState.author} onChange={handleChange} required />
                        <Input label="ISBN" id="isbn" name="isbn" value={formState.isbn} onChange={handleChange} />
                        <Input label="Quantidade Total em Stock" id="totalStock" name="totalStock" type="number" min="1" value={formState.totalStock} onChange={handleChange} required />
                    </div>
                    
                    {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                    
                    <div className="flex justify-end mt-8 gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/biblioteca')}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Livro'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default BookForm;
