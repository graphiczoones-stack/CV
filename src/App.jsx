import { useState } from 'react';
import { CvProvider } from './context/CvContext';
import MainLayout from './components/MainLayout';
import IntroAnimation from './components/IntroAnimation';
import './App.css'; // Ensure we have base styles if needed

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem('hasSeenIntro');
  });

  const handleIntroComplete = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro ? (
        <IntroAnimation onComplete={handleIntroComplete} />
      ) : (
        <div className="app-content-fade-in">
          <CvProvider>
            <MainLayout />
          </CvProvider>
        </div>
      )}
    </>
  );
}

export default App;
