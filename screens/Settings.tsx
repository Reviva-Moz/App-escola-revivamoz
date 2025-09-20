import React, { useState, FC, useEffect } from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { SystemSettings, UserAccount, UserRole } from '../types';
import { ROLES } from '../constants';
import DataTable from '../components/DataTable';
import { Badge } from '../components/ui/Badge';
import { KeyIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';


const UserFormModal: FC<{
    user: Partial<UserAccount> | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<UserAccount, 'id' | 'lastLogin'> & { id?: number }) => void;
}> = ({ user, isOpen, onClose, onSave }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('ALUNO');
    const [password, setPassword] = useState('');
    const isEditing = !!user?.id;

    useEffect(() => {
        if(isOpen) {
            setEmail(user?.email || '');
            setRole(user?.role || 'ALUNO');
            setPassword('');
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: user?.id, email, role });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isEditing} />
                <Select id="role" label="Perfil de Acesso" value={role} onChange={e => setRole(e.target.value as UserRole)} required>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
                {!isEditing && (
                    <Input id="password" label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                )}
                 <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </div>
            </form>
        </Modal>
    )
};


const Settings: React.FC = () => {
  const { systemSettings, users, updateSettings, addUser, updateUser, deleteUser } = useData();

  const [settings, setSettings] = useState<SystemSettings>(systemSettings);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  useEffect(() => {
      setSettings(systemSettings);
  }, [systemSettings]);


  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveSettings = () => {
    updateSettings(settings);
    alert("Configurações salvas com sucesso!");
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este utilizador?")) {
        deleteUser(id);
    }
  };
  
  const handleSaveUser = (userData: Omit<UserAccount, 'id' | 'lastLogin'> & { id?: number }) => {
    if (userData.id) { // Editing
        const existingUser = users.find(u => u.id === userData.id);
        if(existingUser) {
            updateUser({ ...existingUser, role: userData.role });
        }
    } else { // Adding
        addUser({ email: userData.email, role: userData.role });
    }
    setUserModalOpen(false);
  };
  
  const roleVariantMapping = {
    ADMINISTRADOR: 'destructive' as const,
    DIRETORIA: 'default' as const,
    SECRETARIA: 'warning' as const,
    PROFESSOR: 'default' as const,
    RESPONSAVEL: 'default' as const,
    ALUNO: 'default' as const,
  };

  const userRows = users.map(user => [
    <span className="font-medium text-gray-900 dark:text-gray-200">{user.email}</span>,
    <Badge variant={roleVariantMapping[user.role] || 'default'}>{user.role}</Badge>,
    new Date(user.lastLogin).toLocaleString('pt-MZ'),
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
        <Button variant="link" size="sm" onClick={() => handleEditUser(user)}><PencilIcon className="h-4 w-4 mr-1"/>Editar</Button>
        <Button variant="link" size="sm" onClick={() => alert(`A ação de reset de senha para ${user.email} seria enviada aqui.`)}><KeyIcon className="h-4 w-4 mr-1"/> Reset</Button>
        <Button variant="link" size="sm" className="text-red-500" onClick={() => handleDeleteUser(user.id)}><TrashIcon className="h-4 w-4 mr-1"/>Remover</Button>
    </div>
  ]);

  return (
    <>
      <PageHeader title="Configurações do Sistema" subtitle="Gira as configurações globais da aplicação" />
      
      <div className="space-y-8">
        <Card>
           <div className="p-4 border-b border-slate-200 dark:border-slate-700">
               <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Informações da Escola</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="schoolName" name="schoolName" label="Nome da Escola" value={settings.schoolName} onChange={handleSettingsChange}/>
                <Input id="address" name="address" label="Endereço" value={settings.address} onChange={handleSettingsChange}/>
                <Input id="phone" name="phone" label="Telefone" value={settings.phone} onChange={handleSettingsChange}/>
                <Input id="email" name="email" label="Email Geral" type="email" value={settings.email} onChange={handleSettingsChange}/>
            </div>
        </Card>

         <Card>
           <div className="p-4 border-b border-slate-200 dark:border-slate-700">
               <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Configurações Académicas e Financeiras</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="currentAcademicYear" name="currentAcademicYear" label="Ano Letivo Corrente" type="number" value={settings.currentAcademicYear} onChange={handleSettingsChange} />
                <Input id="defaultTuition" name="defaultTuition" label="Valor Padrão da Mensalidade (MZN)" type="number" value={settings.defaultTuition} onChange={handleSettingsChange} />
            </div>
        </Card>

        <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>Salvar Todas as Configurações</Button>
        </div>

        <Card>
             <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
               <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Gestão de Utilizadores</h3>
               <Button onClick={handleAddUser}><PlusIcon className="h-5 w-5 mr-2"/>Adicionar Utilizador</Button>
            </div>
            <DataTable title="" headers={['Email', 'Perfil de Acesso', 'Último Login', 'Ações']} rows={userRows} />
        </Card>
      </div>

      <UserFormModal 
        isOpen={isUserModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </>
  );
};

export default Settings;