
import React from 'react';
import { Card } from '../ui/Card';

interface QuickLinkCardProps {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ title, icon, onClick }) => {
    return (
        <Card 
            className="text-center p-6 transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            onClick={onClick}
        >
            <div className="w-12 h-12 mx-auto bg-reviva-green text-white rounded-lg flex items-center justify-center mb-4">
                {/* FIX: Cast icon element props to 'any' to resolve TypeScript error with cloneElement */}
                {React.cloneElement(icon as React.ReactElement<any>, { className: 'h-7 w-7' })}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        </Card>
    );
};

export default QuickLinkCard;