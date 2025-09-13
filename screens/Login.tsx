import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Simple validation for demonstration
        if (email === 'admin@reviva.com' && password === 'admin') {
            login();
            navigate('/');
        } else {
            setError('Credenciais inválidas. Tente "admin@reviva.com" e "admin".');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                 <svg className="mx-auto h-20 w-auto bg-reviva-green p-3 rounded-full" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="58" stroke="#FFFFFF" strokeWidth="4"/>
                    <path d="M60 95C68.2843 95 75 88.2843 75 80H45C45 88.2843 51.7157 95 60 95Z" fill="#FFFFFF"/>
                    <path d="M60 80V30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M60 50C75 50 75 30 60 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M60 50C45 50 45 30 60 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M60 65C70 65 70 50 60 50" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M60 65C50 65 50 50 60 50" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                    <circle cx="80" cy="40" r="5" fill="#FFFFFF"/>
                    <circle cx="85" cy="55" r="5" fill="#FFFFFF"/>
                    <circle cx="75" cy="68" r="5" fill="#FFFFFF"/>
                    <circle cx="40" cy="40" r="5" fill="#FFFFFF"/>
                    <circle cx="35" cy="55" r="5" fill="#FFFFFF"/>
                    <circle cx="45" cy="68" r="5" fill="#FFFFFF"/>
                    <circle cx="60" cy="25" r="5" fill="#FFFFFF"/>
                </svg>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Bem-vindo à Escola Reviva
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Acesse o sistema de gestão escolar
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-reviva-green focus:border-reviva-green sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-reviva-green focus:border-reviva-green sm:text-sm"
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
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Lembrar de mim
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-reviva-green hover:text-reviva-green-dark">
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
            </div>
        </div>
    );
};

export default Login;