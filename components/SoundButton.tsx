import React, { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { speakText } from '../services/geminiService';

interface SoundButtonProps {
    text: string;
    label?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const SoundButton: React.FC<SoundButtonProps> = ({ text, label, className = '', size = 'md' }) => {
    const [loading, setLoading] = useState(false);

    const playSound = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);

        const audioBuffer = await speakText(text);
        
        if (audioBuffer) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start(0);
        }

        setLoading(false);
    };

    const sizeClasses = {
        sm: 'p-2',
        md: 'p-3',
        lg: 'p-4'
    };

    return (
        <button 
            onClick={playSound}
            disabled={loading}
            className={`flex items-center justify-center gap-2 rounded-full transition-all active:scale-95 ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-110'} ${className} ${sizeClasses[size]}`}
            aria-label={`Play sound for ${text}`}
        >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            {label && <span className="font-bold">{label}</span>}
        </button>
    );
};

export default SoundButton;
