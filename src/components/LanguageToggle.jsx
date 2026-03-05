import React from 'react';
import { useCv } from '../context/CvContext';
import { Languages } from 'lucide-react';
import './LanguageToggle.css';

const LanguageToggle = () => {
    const { cvData, toggleLanguage, isTransitioning } = useCv();
    const isAr = cvData.preferences?.language === 'ar';

    return (
        <button
            className={`language-toggle-premium no-print ${isAr ? 'is-ar' : ''}`}
            onClick={toggleLanguage}
            disabled={isTransitioning}
            title={isAr ? 'Switch to English' : 'تغيير للغة العربية'}
        >
            <Languages size={18} />
            <span>{isAr ? 'English' : 'العربية'}</span>
        </button>
    );
};

export default LanguageToggle;
