import React from 'react';
import Editor from './Editor/Editor';
import A4Page from './Preview/A4Page';
import LanguageToggle from './LanguageToggle';
import HelpButton from './HelpButton';
import { useCv } from '../context/CvContext';
import TransitionOverlay from './TransitionOverlay';
import SiteTour from './SiteTour';
import './MainLayout.css';

const MainLayout = () => {
    const { cvData } = useCv();
    const isAr = cvData.preferences?.language === 'ar';
    const [isTourOpen, setIsTourOpen] = React.useState(false);
    const [showTooltips, setShowTooltips] = React.useState(false);

    React.useEffect(() => {
        const showTimer = setTimeout(() => {
            setShowTooltips(true);
            const hideTimer = setTimeout(() => {
                setShowTooltips(false);
            }, 4000);
            return () => clearTimeout(hideTimer);
        }, 1500);
        return () => clearTimeout(showTimer);
    }, []);

    return (
        <div className={`main-layout ${isAr ? 'rtl' : ''}`}>
            <TransitionOverlay />

            {isTourOpen && (
                <SiteTour isAr={isAr} onClose={() => setIsTourOpen(false)} />
            )}

            <div className="editor-container no-print">
                <Editor showTooltip={showTooltips} />
            </div>
            <div className="preview-container" id="tour-preview">
                <A4Page />
            </div>

            <div className="floating-controls no-print" id="tour-controls">
                <HelpButton showTooltip={showTooltips} onStartTour={() => setIsTourOpen(true)} />
                <LanguageToggle />
            </div>
        </div>
    );
};

export default MainLayout;
