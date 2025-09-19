
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import { Button } from './ui/Button';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Badge } from './ui/Badge';

const MainHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const roleVariantMapping = {
        ADMINISTRADOR: 'destructive' as const,
        DIRETORIA: 'default' as const,
        SECRETARIA: 'warning' as const,
        PROFESSOR: 'default' as const,
        RESPONSAVEL: 'default' as const,
        ALUNO: 'default' as const,
    };

    return (
        <header className="sticky top-0 z-10 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 md:px-8 mb-4">
            <div className="flex items-center justify-end gap-4">
                 <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <UserCircleIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    <div>
                        <p>{user?.email}</p>
                        {user && <Badge variant={roleVariantMapping[user.role] || 'default'}>{user.role}</Badge>}
                    </div>
                </div>
                
                <ThemeSwitcher />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    aria-label="Sair"
                    className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500"
                >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </Button>
            </div>
        </header>
    );
};

export default MainHeader;