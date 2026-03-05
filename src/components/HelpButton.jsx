import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useCv } from '../context/CvContext';
import './HelpButton.css';

const HelpButton = ({ onStartTour, showTooltip }) => {
    const { cvData } = useCv();
    const isAr = cvData.preferences?.language === 'ar';
    const [isHovered, setIsHovered] = useState(false);

    const isVisible = showTooltip || isHovered;

    const handleClick = () => {
        setIsHovered(false);
        if (onStartTour) onStartTour();
    };

    return (
        <div
            className="help-button-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isVisible && (
                <div className={`welcome-popover ${isAr ? 'rtl' : ''}`}>
                    <div className="popover-content">
                        {isAr ? 'تعلم الموقع' : 'Learn the site'}
                    </div>
                    <div className="popover-arrow"></div>
                </div>
            )}
            <button
                className="help-btn-round"
                onClick={handleClick}
                title={isAr ? 'مساعدة' : 'Help'}
            >
                <HelpCircle size={22} />
            </button>
        </div>
    );
};

export default HelpButton;
