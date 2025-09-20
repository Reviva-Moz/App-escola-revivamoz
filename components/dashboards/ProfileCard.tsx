
import React from 'react';
import { Card } from '../ui/Card';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface ProfileCardProps {
    name: string;
    imageUrl?: string | null;
    details: Record<string, string>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, imageUrl, details }) => {
    return (
        <Card>
            <div className="p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                        <img src={imageUrl} alt={`Foto de ${name}`} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-full h-full text-slate-400 dark:text-slate-500" />
                    )}
                </div>
                <h3 className="text-xl font-bold text-reviva-green dark:text-reviva-green-light">{name}</h3>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-3 text-sm">
                {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{key}:</span>
                        <span className="text-right text-slate-800 dark:text-slate-200">{value}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ProfileCard;
