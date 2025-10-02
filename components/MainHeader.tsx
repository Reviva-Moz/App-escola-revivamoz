

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import { Button } from './ui/Button';
import { ArrowRightOnRectangleIcon, UserCircleIcon, Bars3Icon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { Badge } from './ui/Badge';
import { useOnlineStatus } from '../utils/useOnlineStatus';

interface MainHeaderProps {
  onMenuClick: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isOnline = useOnlineStatus();

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
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between p-4 md:px-8 shadow-sm dark:shadow-none dark:border-b dark:border-slate-800 flex-shrink-0">
            {/* Left side: Menu for mobile, empty for desktop */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    aria-label="Abrir menu"
                    className="md:hidden"
                >
                    <Bars3Icon className="h-6 w-6" />
                </Button>
                <div className="md:hidden text-lg font-bold text-reviva-green dark:text-reviva-green-light">
                   Escola Reviva
                </div>
            </div>

            {/* Right side: User info and actions */}
            <div className="flex items-center gap-2 md:gap-4">
                 {!isOnline && (
                    <div className="flex items-center gap-1 text-sm font-semibold text-red-500 bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-full">
                        <NoSymbolIcon className="h-4 w-4" />
                        <span>Offline</span>
                    </div>
                 )}

                 <div className="hidden sm:flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <UserCircleIcon className="h-8 w-8 text-slate-500 dark:text-slate-400" />
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