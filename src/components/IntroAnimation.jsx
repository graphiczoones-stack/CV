import { useState, useEffect, useRef } from 'react';
import './IntroAnimation.css';

const IntroAnimation = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const videoRef = useRef(null);

    const handleVideoEnd = () => {
        setFadeOut(true);
        setTimeout(onComplete, 800); // Wait for fade out animation
    };

    return (
        <div className={`intro-container ${fadeOut ? 'fade-out' : ''}`}>
            <video
                ref={videoRef}
                className="intro-video"
                src="/Comp 1_1.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
            />
            <button className="skip-btn" onClick={handleVideoEnd}>Skip</button>
        </div>
    );
};

export default IntroAnimation;
