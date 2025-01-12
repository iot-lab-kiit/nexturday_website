import { CardProps } from "../../types/types";

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`rounded-lg border border-zinc-800/50 ${className}`}>
        {children}
    </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 pb-6 ${className}`}>
        {children}
    </div>
);