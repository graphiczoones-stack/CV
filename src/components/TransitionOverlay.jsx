import React from 'react';
import { useCv } from '../context/CvContext';
import './MainLayout.css'; // Reusing existing pulse styles or move them to its own CSS

const TransitionOverlay = () => {
    const { isTransitioning, transitionCount } = useCv();

    if (!isTransitioning) return null;

    return (
        <div className="language-loading-overlay" key={transitionCount}>
            <img src="/logo.svg" alt="Loading" className="loading-pulse-logo" />
        </div>
    );
};

export default TransitionOverlay;
