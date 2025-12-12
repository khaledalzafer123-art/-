import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, BookOpen, Pencil, Trophy, Home, ArrowLeft, ArrowRight, CheckCircle, XCircle, Sun, Moon, QrCode, Copy } from 'lucide-react';
import { ARABIC_LETTERS } from './constants';
import { LetterData, QuizQuestion } from './types';
import DrawingCanvas from './components/DrawingCanvas';
import SoundButton from './components/SoundButton';
import { getEncouragement, speakText } from './services/geminiService';

// --- Copyright Footer Component with Share Feature ---
const Footer = () => {
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Use current browser location
    const currentUrl = window.location.href;
    // Generate QR using a reliable public API
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

    const copyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <footer className="w-full bg-slate-800 text-white p-4 shadow-inner z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm md:text-base font-tajawal text-center md:text-right flex-1">
                    حقوق الملكية الفكرية محفوظة لمعلم صعوبات التعلم : <span className="font-bold text-yellow-400">خالد فالح آل ظافر</span>
                </p>
                <button 
                    onClick={() => setShowQR(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-sm font-bold whitespace-nowrap"
                >
                    <QrCode className="w-4 h-4" />
                    <span>مشاركة التطبيق</span>
                </button>
            </footer>

            {/* QR Modal */}
            {showQR && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQR(false)}>
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-bounce-slow text-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-black text-gray-800 mb-4">امسح الكود للمشاركة</h3>
                        <div className="bg-gray-50 p-4 rounded-xl border-4 border-dashed border-gray-200 inline-block mb-4">
                            <img src={qrImage} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                        </div>
                        <p className="text-gray-400 mb-6 font-bold text-xs break-all px-2">{currentUrl}</p>
                        <div className="flex gap-2">
                             <button onClick={copyLink} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold shadow-md transition-all ${copied ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>
                                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'تم النسخ' : 'نسخ الرابط'}
                            </button>
                            <button onClick={() => setShowQR(false)} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 shadow-md">
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// --- Menu Component ---
const MainMenu = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <header className="mb-12 text-center animate-bounce-slow">
            <h1 className="text-6xl font-black text-green-600 drop-shadow-lg mb-4">مغامرات الحروف</h1>
            <p className="text-2xl text-blue-600 font-bold">هيا نتعلم ونلعب معاً!</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            <Link to="/learn" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-yellow-400">
            <div className="flex flex-col items-center">
                <div className="bg-yellow-100 p-6 rounded-full mb-6 group-hover:rotate-12 transition-transform">
                <BookOpen className="w-16 h-16 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">تعلم الحروف</h2>
                <p className="text-gray-500 mt-2 text-center">أصوات وأشكال الحروف</p>
            </div>
            </Link>

            <Link to="/sun-moon" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-orange-400">
            <div className="flex flex-col items-center">
                <div className="bg-orange-100 p-6 rounded-full mb-6 group-hover:rotate-12 transition-transform flex gap-1">
                <Sun className="w-8 h-8 text-orange-600" />
                <Moon className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">ال الشمسية والقمرية</h2>
                <p className="text-gray-500 mt-2 text-center">قراءة وكتابة</p>
            </div>
            </Link>

            <Link to="/write" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-purple-400">
            <div className="flex flex-col items-center">
                <div className="bg-purple-100 p-6 rounded-full mb-6 group-hover:rotate-12 transition-transform">
                <Pencil className="w-16 h-16 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">أكتب الحروف</h2>
                <p className="text-gray-500 mt-2 text-center">تدرب على الكتابة</p>
            </div>
            </Link>

            <Link to="/quiz" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-rose-400">
            <div className="flex flex-col items-center">
                <div className="bg-rose-100 p-6 rounded-full mb-6 group-hover:rotate-12 transition-transform">
                <Trophy className="w-16 h-16 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">المسابقة</h2>
                <p className="text-gray-500 mt-2 text-center">اختبر معلوماتك</p>
            </div>
            </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- Learn Component ---
const LearnSection = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const letter = ARABIC_LETTERS[selectedIndex];

    const nextLetter = () => setSelectedIndex((prev) => (prev + 1) % ARABIC_LETTERS.length);
    const prevLetter = () => setSelectedIndex((prev) => (prev - 1 + ARABIC_LETTERS.length) % ARABIC_LETTERS.length);

    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            <NavBar title="تعلم الحروف" color="bg-yellow-500" />
            
            <div className="flex-1 container mx-auto p-4 flex flex-col items-center">
                
                {/* Header Navigation with Big Letter */}
                <div className="flex items-center justify-between w-full max-w-4xl mb-4">
                    <button onClick={prevLetter} className="p-3 md:p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transform hover:scale-110 transition-transform">
                        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
                    </button>
                    <div className="text-7xl md:text-9xl font-black text-yellow-600 animate-pulse-slow drop-shadow-md font-tajawal">
                        {letter.char}
                    </div>
                    <button onClick={nextLetter} className="p-3 md:p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transform hover:scale-110 transition-transform">
                        <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
                    
                    {/* Left Column: Letter Sounds (Short & Long) */}
                    <div className="flex flex-col gap-6 order-2 md:order-1">
                        
                        {/* Short Vowels (Harakat) */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-200">
                            <h3 className="text-2xl font-bold text-center mb-6 text-gray-700 flex items-center justify-center gap-2">
                                <span>الحركات القصيرة</span>
                                <span className="text-sm bg-yellow-100 px-2 py-1 rounded-lg text-yellow-700">أصوات</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <SoundRow text={letter.sounds.fatha} label="فتحة" color="red" />
                                <SoundRow text={letter.sounds.kasra} label="كسرة" color="blue" />
                                <SoundRow text={letter.sounds.damma} label="ضمة" color="green" />
                            </div>
                        </div>

                        {/* Long Vowels (Madood) */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-orange-200">
                            <h3 className="text-2xl font-bold text-center mb-6 text-gray-700 flex items-center justify-center gap-2">
                                <span>المدود الطويلة</span>
                                <span className="text-sm bg-orange-100 px-2 py-1 rounded-lg text-orange-700">مد</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <SoundRow text={letter.madood.alif} label="مد بالألف" color="orange" />
                                <SoundRow text={letter.madood.yaa} label="مد بالياء" color="indigo" />
                                <SoundRow text={letter.madood.waw} label="مد بالواو" color="teal" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Word Association & Forms */}
                    <div className="flex flex-col gap-6 order-1 md:order-2">
                        {/* Word Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-indigo-200 flex flex-col items-center justify-center text-center transform hover:scale-[1.02] transition-transform">
                             <div className="text-8xl mb-4 animate-bounce-slow">{letter.emoji}</div>
                             <div className="text-4xl font-black text-indigo-800 mb-4">{letter.exampleWord}</div>
                             <SoundButton text={letter.exampleWord} label="استمع للكلمة" className="bg-indigo-500 text-white hover:bg-indigo-600 w-full rounded-xl py-3 shadow-lg" />
                        </div>

                        {/* Forms Summary */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                             <h3 className="text-lg font-bold text-center mb-4 text-gray-500">أشكال الحرف</h3>
                             <div className="flex justify-between items-end text-center dir-rtl">
                                <FormCardSmall title="أول" char={letter.forms.start} />
                                <FormCardSmall title="وسط" char={letter.forms.middle} />
                                <FormCardSmall title="آخر" char={letter.forms.end} />
                                <FormCardSmall title="منفصل" char={letter.forms.isolated} />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Helper component for sound rows
const SoundRow = ({text, label, color}: {text: string, label: string, color: string}) => {
    // Mapping colors to Tailwind classes
    const colorClasses: Record<string, string> = {
        red: 'bg-red-50 border-red-100 text-red-600 text-red-400',
        blue: 'bg-blue-50 border-blue-100 text-blue-600 text-blue-400',
        green: 'bg-green-50 border-green-100 text-green-600 text-green-400',
        orange: 'bg-orange-50 border-orange-100 text-orange-600 text-orange-400',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600 text-indigo-400',
        teal: 'bg-teal-50 border-teal-100 text-teal-600 text-teal-400',
    };

    const btnClasses: Record<string, string> = {
        red: 'bg-red-500 text-white hover:bg-red-600',
        blue: 'bg-blue-500 text-white hover:bg-blue-600',
        green: 'bg-green-500 text-white hover:bg-green-600',
        orange: 'bg-orange-500 text-white hover:bg-orange-600',
        indigo: 'bg-indigo-500 text-white hover:bg-indigo-600',
        teal: 'bg-teal-500 text-white hover:bg-teal-600',
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-2xl border-2 hover:bg-opacity-80 transition-colors ${colorClasses[color]}`}>
            <span className="text-4xl font-bold">{text}</span>
            <div className="flex items-center gap-3">
                <span className="text-lg font-bold opacity-70">{label}</span>
                <SoundButton text={text} size="md" className={`${btnClasses[color]} shadow-md`} />
            </div>
        </div>
    );
};

const FormCardSmall = ({title, char}: {title: string, char: string}) => (
    <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-gray-800 mb-1">{char}</div>
        <div className="text-xs text-gray-400 font-bold">{title}</div>
    </div>
);

// --- Sun & Moon Component ---
const SunMoonSection = () => {
    const [selectedType, setSelectedType] = useState<'sun' | 'moon' | null>(null);
    const [viewMode, setViewMode] = useState<'read' | 'write'>('read');
    const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);

    // Filter letters based on selection
    const filteredLetters = ARABIC_LETTERS.filter(l => l.sunOrMoon === selectedType);

    const handleBack = () => {
        setSelectedType(null);
        setSelectedLetter(null);
        setViewMode('read');
    }

    if (!selectedType) {
        return (
            <div className="min-h-screen bg-sky-50 flex flex-col">
                <NavBar title="ال الشمسية والقمرية" color="bg-orange-500" />
                <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
                    <h2 className="text-4xl font-black text-gray-700 mb-8 text-center">ماذا تريد أن تتعلم اليوم؟</h2>
                    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                        <button onClick={() => setSelectedType('sun')} className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-orange-50 border-b-8 border-orange-400 transition-all transform hover:-translate-y-2">
                             <div className="flex flex-col items-center">
                                <Sun className="w-32 h-32 text-orange-500 mb-4 animate-spin-slow" />
                                <div className="text-4xl font-black text-orange-600">اللام الشمسية</div>
                                <div className="mt-4 text-gray-500 text-xl font-bold bg-orange-100 px-4 py-2 rounded-full">تكتب ولا تنطق</div>
                            </div>
                        </button>
                        <button onClick={() => setSelectedType('moon')} className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-blue-50 border-b-8 border-blue-400 transition-all transform hover:-translate-y-2">
                             <div className="flex flex-col items-center">
                                <Moon className="w-32 h-32 text-blue-500 mb-4 animate-pulse" />
                                <div className="text-4xl font-black text-blue-600">اللام القمرية</div>
                                <div className="mt-4 text-gray-500 text-xl font-bold bg-blue-100 px-4 py-2 rounded-full">تكتب وتنطق</div>
                            </div>
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className={`min-h-screen flex flex-col ${selectedType === 'sun' ? 'bg-orange-50' : 'bg-blue-50'}`}>
            <NavBar title={selectedType === 'sun' ? "اللام الشمسية" : "اللام القمرية"} color={selectedType === 'sun' ? "bg-orange-500" : "bg-blue-600"} />
            
            <div className="flex-1 container mx-auto p-4 flex flex-col items-center">
                <button onClick={handleBack} className="self-end mb-4 flex items-center gap-2 font-bold text-gray-500 hover:text-gray-800 bg-white px-4 py-2 rounded-full shadow-sm">
                    <ArrowRight /> رجوع للقائمة
                </button>

                {/* Info Card */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-opacity-50 w-full max-w-4xl mb-8 flex flex-col md:flex-row items-center gap-6 border-gray-200">
                    <div className={`p-4 rounded-full ${selectedType === 'sun' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                        {selectedType === 'sun' ? <Sun className="w-16 h-16 text-orange-500" /> : <Moon className="w-16 h-16 text-blue-500" />}
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <h3 className="text-2xl font-bold mb-2">
                            {selectedType === 'sun' ? 'الشمس تحرق اللام!' : 'القمر يحب اللام!'}
                        </h3>
                        <p className="text-lg text-gray-600">
                             {selectedType === 'sun' 
                                ? 'في اللام الشمسية، نكتب اللام ولكن لا ننطقها، ونضع شدة (ّ) على الحرف الذي بعدها.' 
                                : 'في اللام القمرية، نكتب اللام وننطقها واضحة ساكنة (لْ).'}
                        </p>
                    </div>
                    <SoundButton 
                        text={selectedType === 'sun' ? 'اللام الشمسية تكتب ولا تنطق' : 'اللام القمرية تكتب وتنطق'} 
                        label="استمع للقاعدة" 
                        className={selectedType === 'sun' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}
                    />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white p-2 rounded-2xl shadow-md mb-8">
                    <button 
                        onClick={() => { setViewMode('read'); setSelectedLetter(null); }}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${viewMode === 'read' ? (selectedType === 'sun' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white') : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <BookOpen className="inline-block ml-2 w-5 h-5" /> قراءة
                    </button>
                    <button 
                        onClick={() => { setViewMode('write'); setSelectedLetter(null); }}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${viewMode === 'write' ? (selectedType === 'sun' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white') : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Pencil className="inline-block ml-2 w-5 h-5" /> كتابة
                    </button>
                </div>

                {/* Main Interaction Area */}
                {viewMode === 'read' ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-5xl">
                        {filteredLetters.map(l => (
                            <button 
                                key={l.id}
                                onClick={() => setSelectedLetter(l)}
                                className={`bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center border-b-4 ${selectedLetter?.id === l.id ? (selectedType === 'sun' ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50') : 'border-gray-200'}`}
                            >
                                <span className="text-4xl mb-2">{l.emoji}</span>
                                <span className="text-2xl font-black text-gray-800">{l.char}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="w-full max-w-5xl">
                        <p className="text-center text-gray-500 mb-4 font-bold">اختر كلمة لتتدرب على كتابتها مع (ال)</p>
                         <div className="flex overflow-x-auto gap-3 p-2 mb-6 snap-x no-scrollbar justify-center flex-wrap">
                            {filteredLetters.map(l => (
                                <button 
                                    key={l.id}
                                    onClick={() => setSelectedLetter(l)}
                                    className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${selectedLetter?.id === l.id ? (selectedType === 'sun' ? 'bg-orange-500 text-white border-orange-600' : 'bg-blue-500 text-white border-blue-600') : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {l.wordWithAl}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Letter Detail (Overlay or Section) */}
                {selectedLetter && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLetter(null)}>
                        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-bounce-slow" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-400">
                                    {viewMode === 'read' ? 'استمع وردد' : 'تدرب على الكتابة'}
                                </h3>
                                <button onClick={() => setSelectedLetter(null)} className="p-2 hover:bg-gray-100 rounded-full"><XCircle className="w-8 h-8 text-red-500" /></button>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="text-8xl mb-6">{selectedLetter.emoji}</div>
                                
                                {viewMode === 'read' ? (
                                    <>
                                        <div className={`text-6xl font-black mb-8 ${selectedType === 'sun' ? 'text-orange-600' : 'text-blue-600'}`}>
                                            {selectedLetter.wordWithAl}
                                        </div>
                                        <SoundButton 
                                            text={selectedLetter.wordWithAl} 
                                            label="استمع للكلمة" 
                                            size="lg"
                                            className={`w-full ${selectedType === 'sun' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full">
                                        <DrawingCanvas letter={selectedLetter.wordWithAl} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </div>
    );
};


// --- Write Component ---
const WriteSection = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedForm, setSelectedForm] = useState<'isolated' | 'start' | 'middle' | 'end'>('isolated');
    
    const letter = ARABIC_LETTERS[selectedIndex];

    // Reset form to isolated when changing letters
    useEffect(() => {
        setSelectedForm('isolated');
    }, [selectedIndex]);

    const getFormChar = () => letter.forms[selectedForm];

    return (
        <div className="min-h-screen bg-purple-50 flex flex-col">
            <NavBar title="أكتب الحروف" color="bg-purple-500" />
            
            <div className="flex-1 container mx-auto p-4 flex flex-col items-center">
                {/* Scrollable Letter Selector */}
                <div className="flex overflow-x-auto w-full max-w-4xl gap-3 p-2 mb-6 snap-x no-scrollbar">
                    {ARABIC_LETTERS.map((l, idx) => (
                        <button 
                            key={l.id}
                            onClick={() => setSelectedIndex(idx)}
                            className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all border-2 ${selectedIndex === idx ? 'bg-purple-600 border-purple-800 text-white scale-110 shadow-lg' : 'bg-white border-purple-100 text-purple-900 hover:bg-purple-50'}`}
                        >
                            {l.char}
                        </button>
                    ))}
                </div>

                <div className="w-full max-w-2xl flex flex-col gap-6">
                    {/* Visual Reference Card */}
                    <div className="bg-white rounded-3xl p-4 shadow-md flex items-center justify-between border-2 border-purple-100">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">{letter.emoji}</div>
                            <div>
                                <div className="text-sm text-gray-400 font-bold">مثال</div>
                                <div className="text-2xl font-black text-purple-800">{letter.exampleWord}</div>
                            </div>
                        </div>
                        <SoundButton text={`هيا نكتب حرف ${letter.name}`} label="تعليمات" size="sm" className="bg-purple-100 text-purple-700 hover:bg-purple-200" />
                    </div>

                    {/* Form Tabs */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm flex justify-between gap-2">
                         <FormTab label="منفصل" active={selectedForm === 'isolated'} onClick={() => setSelectedForm('isolated')} char={letter.forms.isolated} />
                         <FormTab label="أول الكلمة" active={selectedForm === 'start'} onClick={() => setSelectedForm('start')} char={letter.forms.start} />
                         <FormTab label="وسط الكلمة" active={selectedForm === 'middle'} onClick={() => setSelectedForm('middle')} char={letter.forms.middle} />
                         <FormTab label="آخر الكلمة" active={selectedForm === 'end'} onClick={() => setSelectedForm('end')} char={letter.forms.end} />
                    </div>

                    {/* Canvas Area */}
                    <div className="flex flex-col items-center justify-center w-full">
                        <DrawingCanvas letter={getFormChar()} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const FormTab = ({label, active, onClick, char}: {label: string, active: boolean, onClick: () => void, char: string}) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-3 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${active ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300 ring-offset-2' : 'hover:bg-gray-50 text-gray-600'}`}
    >
        <span className="text-xs font-bold opacity-80">{label}</span>
        <span className="text-2xl font-bold">{char}</span>
    </button>
);

// --- Quiz Component ---
const QuizSection = () => {
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [aiEncouragement, setAiEncouragement] = useState<string>("");
    const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);

    useEffect(() => {
        generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionCount]);

    const generateQuestion = () => {
        const type = Math.random() > 0.5 ? 'sound_to_letter' : 'form_identification';
        const targetLetter = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
        
        // Generate distractors
        const distractors = ARABIC_LETTERS
            .filter(l => l.id !== targetLetter.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        
        const options = [targetLetter, ...distractors].sort(() => 0.5 - Math.random());

        if (type === 'sound_to_letter') {
            // Pick a random sound (fatha, kasra, or damma)
            const soundKeys = ['fatha', 'kasra', 'damma'] as const;
            const soundKey = soundKeys[Math.floor(Math.random() * 3)];
            const soundChar = targetLetter.sounds[soundKey];

            setCurrentQuestion({
                type: 'sound_to_letter',
                questionText: soundChar, // Visual hint optional, mostly audio
                correctAnswer: targetLetter.id,
                options: options.map(o => o.id),
                questionAudio: soundChar // Text to speak
            });
        } else {
            // Form identification (Find the letter at the start of a word...)
            // Simplified: Show a form, ask which letter it is
            const forms = ['start', 'middle', 'end'] as const;
            const formType = forms[Math.floor(Math.random() * 3)];
            const displayChar = targetLetter.forms[formType];

            setCurrentQuestion({
                type: 'form_identification',
                questionText: displayChar,
                correctAnswer: targetLetter.id,
                options: options.map(o => o.id)
            });
        }
        setFeedback(null);
    };

    const handleAnswer = async (selectedId: string) => {
        if (!currentQuestion || feedback) return;

        const isCorrect = selectedId === currentQuestion.correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback('correct');
            const msg = await getEncouragement(score + 1, 10); // Simple call
            setAiEncouragement(msg);
        } else {
            setFeedback('incorrect');
            setAiEncouragement("حاول مرة أخرى يا بطل!");
        }

        setTimeout(() => {
            if (questionCount < 9) {
                setQuestionCount(prev => prev + 1);
            } else {
                // Game Over state handling could go here
                setQuestionCount(0);
                setScore(0);
            }
        }, 2500);
    };

    const playQuestionAudio = async () => {
        if(!currentQuestion?.questionAudio || isPlayingQuestion) return;
        setIsPlayingQuestion(true);
        const buffer = await speakText(currentQuestion.questionAudio);
        if (buffer) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(0);
            source.onended = () => setIsPlayingQuestion(false);
        } else {
            setIsPlayingQuestion(false);
        }
    }

    // Auto play audio for sound questions
    useEffect(() => {
        if(currentQuestion?.type === 'sound_to_letter' && !feedback) {
             const timer = setTimeout(() => playQuestionAudio(), 500);
             return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion]);

    if (!currentQuestion) return <div className="min-h-screen bg-rose-50 flex items-center justify-center">Loading...</div>;

    const getLetterById = (id: string) => ARABIC_LETTERS.find(l => l.id === id);

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col">
            <NavBar title="المسابقة" color="bg-rose-500" />
            
            <div className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center max-w-3xl">
                <div className="w-full flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-600">
                        <Star className="text-yellow-400 fill-yellow-400" />
                        <span>{score}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-400">
                        سؤال {questionCount + 1} / 10
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl w-full p-8 mb-8 text-center relative overflow-hidden">
                     {/* Confetti or Feedback Overlay */}
                    {feedback && (
                        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-10 transition-opacity ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                            {feedback === 'correct' ? <CheckCircle className="w-24 h-24 mb-4 animate-bounce" /> : <XCircle className="w-24 h-24 mb-4" />}
                            <h2 className="text-4xl font-black mb-2">{feedback === 'correct' ? 'ممتاز!' : 'خاطئ'}</h2>
                            <p className="text-xl text-gray-600">{aiEncouragement}</p>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-gray-700 mb-8">
                        {currentQuestion.type === 'sound_to_letter' 
                            ? 'أي حرف يصدر هذا الصوت؟' 
                            : 'أي حرف يطابق هذا الشكل؟'}
                    </h2>
                    
                    <div className="flex justify-center mb-10">
                        {currentQuestion.type === 'sound_to_letter' ? (
                            <button 
                                onClick={playQuestionAudio}
                                className={`p-8 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-transform hover:scale-110 shadow-inner ${isPlayingQuestion ? 'animate-pulse' : ''}`}
                            >
                                <Volume2Icon size={64} />
                            </button>
                        ) : (
                            <div className="text-9xl font-tajawal font-black text-rose-600">
                                {currentQuestion.questionText}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {currentQuestion.options.map((optId) => {
                            const letter = getLetterById(optId);
                            if (!letter) return null;
                            return (
                                <button
                                    key={optId}
                                    onClick={() => handleAnswer(optId)}
                                    className="aspect-square bg-gray-50 hover:bg-rose-100 border-b-4 border-gray-200 hover:border-rose-300 rounded-2xl text-6xl font-bold text-gray-700 hover:text-rose-700 transition-all active:translate-y-1 active:border-b-0"
                                >
                                    {letter.char}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// --- Shared Components ---
const NavBar = ({title, color}: {title: string, color: string}) => (
    <div className={`${color} p-4 shadow-lg sticky top-0 z-50`}>
        <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors">
                <Home className="w-8 h-8" />
            </Link>
            <h1 className="text-3xl font-black text-white">{title}</h1>
            <div className="w-12"></div> {/* Spacer for center alignment */}
        </div>
    </div>
);

const Volume2Icon = ({size}: {size: number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
);


const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/learn" element={<LearnSection />} />
        <Route path="/sun-moon" element={<SunMoonSection />} />
        <Route path="/write" element={<WriteSection />} />
        <Route path="/quiz" element={<QuizSection />} />
      </Routes>
    </HashRouter>
  );
};

export default App;