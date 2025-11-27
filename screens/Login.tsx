import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole, UserAccount } from '@/types';
import Logo from '@/components/Logo';
import { loadDataFromLocalDB } from '@/utils/db';
import { Button } from '@/components/ui/Button';

const HARDCODED_USERS: Record<string, { password: string; role: UserRole }> = {
    'admin@reviva.mz': { password: '123456', role: 'ADMINISTRADOR' },
    'direccao@reviva.mz': { password: '123456', role: 'DIRETORIA' },
    'secretaria@reviva.mz': { password: '123456', role: 'SECRETARIA' },
    'responsavel@reviva.mz': { password: '123456', role: 'RESPONSAVEL' },
    'professor@reviva.mz': { password: '123456', role: 'PROFESSOR' },
    'aluno@reviva.mz': { password: '123456', role: 'ALUNO' },
    'admin@reviva.com': { password: 'admin', role: 'ADMINISTRADOR' },
};

const QUICK_LOGINS = [
    { label: 'Admin', email: 'admin@reviva.mz', role: 'ADMINISTRADOR', color: 'bg-red-100 text-red-800 border-red-200' },
    { label: 'Diretoria', email: 'direccao@reviva.mz', role: 'DIRETORIA', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { label: 'Secretaria', email: 'secretaria@reviva.mz', role: 'SECRETARIA', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { label: 'Professor', email: 'professor@reviva.mz', role: 'PROFESSOR', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { label: 'Aluno', email: 'aluno@reviva.mz', role: 'ALUNO', color: 'bg-green-100 text-green-800 border-green-200' },
    { label: 'Responsável', email: 'responsavel@reviva.mz', role: 'RESPONSAVEL', color: 'bg-orange-100 text-orange-800 border-orange-200' },
];

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [dbUsers, setDbUsers] = useState<UserAccount[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await loadDataFromLocalDB('users');
                if (users && Array.isArray(users)) {
                    setDbUsers(users);
                }
            } catch (err) {
                console.error("Error loading users from DB", err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const emailLower = email.toLowerCase().trim();
        
        // 1. Check hardcoded users (fallback/demo)
        const hardcodedUser = HARDCODED_USERS[emailLower];
        if (hardcodedUser && hardcodedUser.password === password) {
            login(emailLower, hardcodedUser.role);
            navigate('/');
            return;
        }

        // 2. Check dynamic users from DB
        const dbUser = dbUsers.find(u => u.email.toLowerCase() === emailLower);
        if (dbUser) {
            // Check if user has a password set, otherwise allow default '123456' or any match if no password set (insecure, strictly for dev demo)
            const userPassword = dbUser.password || '123456';
            if (password === userPassword) {
                login(dbUser.email, dbUser.role);
                navigate('/');
                return;
            }
        }

        setError('Credenciais inválidas. Verifique o seu e-mail e senha.');
    };

    const handleQuickLogin = (userEmail: string) => {
        const user = HARDCODED_USERS[userEmail];
        if (user) {
            // Direct login for quick access
            login(userEmail, user.role);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Logo />
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                Endereço de Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:placeholder-slate-400 dark:text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-reviva-green focus:border-reviva-green sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:placeholder-slate-400 dark:text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-reviva-green focus:border-reviva-green sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-reviva-green focus:ring-reviva-green-light border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-slate-200">
                                    Lembrar de mim
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" onClick={(e) => { e.preventDefault(); alert('Funcionalidade de recuperação de senha em desenvolvimento.'); }} className="font-medium text-reviva-green hover:text-reviva-green-dark dark:text-reviva-green-light dark:hover:text-reviva-green">
                                    Esqueceu sua senha?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-reviva-green hover:bg-reviva-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reviva-green-light"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Login Section for Demo */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-slate-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400">
                                Acesso Rápido (Demo)
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {QUICK_LOGINS.map((login) => (
                            <div key={login.label}>
                                <button
                                    onClick={() => handleQuickLogin(login.email)}
                                    className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reviva-green transition-colors ${login.color}`}
                                >
                                    {login.label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;