import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const currentLang = i18n.language || 'en';
        const newLang = currentLang.startsWith('ar') ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        const isArabic = i18n.language?.startsWith('ar');
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/50 hover:bg-gray-100 border border-gray-200 transition-all text-gray-700 font-medium active:scale-95"
            aria-label="Toggle Language"
        >
            <Globe size={18} className="text-gray-600" />
            <span>{i18n.language?.startsWith('ar') ? 'English' : 'عربي'}</span>
        </button>
    );
};
