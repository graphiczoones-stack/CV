import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Key, Briefcase, Check, AlertCircle, Wand2, HelpCircle, ExternalLink } from 'lucide-react';
import { useCv } from '../../context/CvContext';
import './AiOptimizer.css';

const AiOptimizer = ({ isOpen, onClose }) => {
    const { cvData, updatePersonal, updateExperience, updateSkills } = useCv();
    const [apiKey, setApiKey] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [inlineFeedback, setInlineFeedback] = useState({});
    const [showHelp, setShowHelp] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Sync isClosing state with isOpen prop
    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // Animation duration
    };

    const showFeedback = (id) => {
        setInlineFeedback(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);
    }, []);

    const handleApiKeyChange = (e) => {
        const key = e.target.value;
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const handleOptimize = async () => {
        if (!apiKey) {
            setError('Please enter a valid Gemini API Key.');
            return;
        }
        if (!jobDescription.trim()) {
            setError('Please enter a Job Description.');
            return;
        }

        setIsLoading(true);
        setError('');
        setInlineFeedback({});
        setSuggestions(null); // Clear old suggestions

        try {
            // Using Gemini 2.5 Flash as confirmed from user's screenshot
            const modelName = 'gemini-2.5-flash';
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `
                                    IMPORTANT: Respond ONLY with a valid JSON object. No conversational text.
                                    TASK: Suggest NEW CV content (summary, skills, experience tips, courses) based on the Job Description.
                                    IF JD IS UNCLEAR: Provide general high-quality suggestions for a "Professional Role".
                                    
                                    Structure:
                                    {
                                      "summary": "Full text...",
                                      "recommended_job_title": "Title...",
                                      "technical_skills_to_add": [],
                                      "soft_skills_to_add": [],
                                      "recommended_certifications": [],
                                      "courses": [],
                                      "experience_recommendations": [{"position": "...", "potential_companies": [], "duration_needed": "...", "focus_points": []}]
                                    }

                                    CV Data: ${JSON.stringify(cvData)}
                                    Job Description: ${jobDescription}
                                `
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.1,
                            responseMimeType: "application/json"
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP Error: ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                if (result.promptFeedback?.blockReason) {
                    throw new Error(`AI Safety Block: ${result.promptFeedback.blockReason}`);
                }
                throw new Error("AI returned no content. Please try a different Job Description.");
            }

            // Clean extraction
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}') + 1;

            if (start === -1 || end <= 0) {
                console.error("DEBUG RAW:", text);
                throw new Error("Invalid AI format. Highlighting certain parts of the Job Description might help.");
            }

            const data = JSON.parse(text.substring(start, end));
            setSuggestions(data);
        } catch (err) {
            console.error("Optimizer Error:", err);
            if (err.message.toLowerCase().includes('quota') || err.message.includes('429')) {
                setError('API Key quota exceeded. Please enter a new key.');
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const applySummary = (text) => {
        updatePersonal('summary', text);
        showFeedback('summary');
    };

    const applyJobTitle = (title) => {
        updatePersonal('title', title);
        showFeedback('jobTitle');
    };

    const applyTechnicalSkills = (skills) => {
        const current = cvData.skills.technical || [];
        const combined = [...new Set([...current, ...skills])];
        updateSkills('technical', combined);
        showFeedback('techSkills');
    };

    const applySoftSkills = (skills) => {
        const current = cvData.skills.soft || [];
        const combined = [...new Set([...current, ...skills])];
        updateSkills('soft', combined);
        showFeedback('softSkills');
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100dvh';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const apiKeyStored = !!localStorage.getItem('gemini_api_key');

    const modalContent = (
        <div className={`ai-optimizer-overlay ${isClosing ? 'is-closing' : ''}`} onClick={handleClose}>
            <div className={`ai-optimizer-drawer ${isClosing ? 'is-closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="mobile-handle"></div>
                <div className="ai-header">
                    <div className="ai-header-title">
                        <img src="/logo.svg" alt="Pro" className="ai-header-logo" />
                        <span className="pro-tag">Pro</span>
                        <span className="ai-sub-title">AI Optimizer</span>
                    </div>
                    <div className="ai-header-actions">
                        <button
                            className={`help-btn ${showHelp ? 'active' : ''}`}
                            onClick={() => setShowHelp(!showHelp)}
                        >
                            <HelpCircle size={18} />
                        </button>
                        <button className="close-btn" onClick={handleClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {showHelp && (
                    <div className="api-help-box">
                        <div className="help-header">
                            <Key size={16} />
                            <span>How to get Gemini API Key?</span>
                        </div>
                        <ol className="help-steps">
                            <li>Go to <strong>Google AI Studio</strong>.</li>
                            <li>Sign in with Google.</li>
                            <li>Click <strong>"Get API key"</strong>.</li>
                            <li>Click <strong>"Create API key"</strong>.</li>
                            <li>Copy and paste the key here.</li>
                        </ol>
                        <div className="help-footer">
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                                Open Studio <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                )}

                <div className="ai-content">
                    <div className="ai-section">
                        <h3><Key size={16} /> Gemini API Key</h3>
                        <div className="api-key-input-group">
                            <input
                                type="password"
                                className="api-key-input"
                                placeholder="Paste your API Key here..."
                                value={apiKey}
                                onChange={handleApiKeyChange}
                            />
                            <button className="get-key-btn" onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}>
                                Get Key <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="ai-section">
                        <h3><Briefcase size={16} /> Job Description</h3>
                        <textarea
                            className="job-description-input"
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <button
                            className="optimize-btn"
                            onClick={handleOptimize}
                            disabled={isLoading || !jobDescription}
                        >
                            {isLoading ? <div className="loading-spinner"></div> : <><Wand2 size={18} /> Optimize My CV</>}
                        </button>
                    </div>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {suggestions && (
                        <div className="suggestions-container">
                            <div className="ai-section">
                                <h3>AI Content Suggestions</h3>

                                {suggestions.recommended_job_title && (
                                    <div className="suggestion-card">
                                        <div className="suggestion-header">
                                            <div className="suggestion-title">Proposed Job Title</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    className={`apply-btn ${inlineFeedback['jobTitle'] ? 'applied' : ''}`}
                                                    onClick={() => applyJobTitle(suggestions.recommended_job_title)}
                                                    disabled={inlineFeedback['jobTitle']}
                                                >
                                                    {inlineFeedback['jobTitle'] ? <><Check size={14} /> Applied</> : 'Apply'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="suggestion-content">{suggestions.recommended_job_title}</div>
                                    </div>
                                )}

                                {suggestions.summary && (
                                    <div className="suggestion-card">
                                        <div className="suggestion-header">
                                            <div className="suggestion-title">Professional Summary</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    className={`apply-btn ${inlineFeedback['summary'] ? 'applied' : ''}`}
                                                    onClick={() => applySummary(suggestions.summary)}
                                                    disabled={inlineFeedback['summary']}
                                                >
                                                    {inlineFeedback['summary'] ? <><Check size={14} /> Applied</> : 'Apply'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="suggestion-content">{suggestions.summary}</div>
                                    </div>
                                )}

                                {suggestions.technical_skills_to_add?.length > 0 && (
                                    <div className="suggestion-card">
                                        <div className="suggestion-header">
                                            <div className="suggestion-title">Technical Skills</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    className={`apply-btn ${inlineFeedback['techSkills'] ? 'applied' : ''}`}
                                                    onClick={() => applyTechnicalSkills(suggestions.technical_skills_to_add)}
                                                    disabled={inlineFeedback['techSkills']}
                                                >
                                                    {inlineFeedback['techSkills'] ? <><Check size={14} /> Added</> : 'Add All'}
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {suggestions.technical_skills_to_add.map((skill, idx) => (
                                                <span key={idx} className="badge">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {suggestions.soft_skills_to_add?.length > 0 && (
                                    <div className="suggestion-card">
                                        <div className="suggestion-header">
                                            <div className="suggestion-title">Soft Skills</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    className={`apply-btn ${inlineFeedback['softSkills'] ? 'applied' : ''}`}
                                                    onClick={() => applySoftSkills(suggestions.soft_skills_to_add)}
                                                    disabled={inlineFeedback['softSkills']}
                                                >
                                                    {inlineFeedback['softSkills'] ? <><Check size={14} /> Added</> : 'Add All'}
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {suggestions.soft_skills_to_add.map((skill, idx) => (
                                                <span key={idx} className="badge">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {suggestions.recommended_certifications?.length > 0 && (
                                    <div className="suggestion-card info-card">
                                        <div className="suggestion-header">
                                            <div className="suggestion-title">Recommended Certifications</div>
                                        </div>
                                        <ul className="help-steps" style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                            {suggestions.recommended_certifications.map((cert, idx) => (
                                                <li key={idx}>{cert}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {suggestions.courses?.length > 0 && (
                                    <div className="suggestion-card info-card">
                                        <div className="suggestion-header">
                                            <div className="suggestion-title">Suggested Courses</div>
                                        </div>
                                        <ul className="help-steps" style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                            {suggestions.courses.map((course, idx) => (
                                                <li key={idx}>{course}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {suggestions.experience_recommendations?.length > 0 && (
                                    <div className="suggestion-card info-card">
                                        <div className="suggestion-header">
                                            <div className="suggestion-title">Experience Recommendations</div>
                                        </div>
                                        <div className="experience-tips">
                                            {suggestions.experience_recommendations.map((exp, idx) => (
                                                <div key={idx} className="exp-mini-card">
                                                    <div className="exp-mini-header">
                                                        <strong>{exp.position}</strong>
                                                    </div>
                                                    <div className="exp-companies">
                                                        Target: {exp.potential_companies?.join(', ')}
                                                    </div>
                                                    <div className="exp-duration">Time needed: {exp.duration_needed}</div>

                                                    {exp.focus_points?.length > 0 && (
                                                        <div className="focus-points-section">
                                                            <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: '8px 0 4px' }}>Points to focus on:</p>
                                                            <ul className="help-steps" style={{ paddingLeft: '1.25rem', margin: 0 }}>
                                                                {exp.focus_points.map((point, pIdx) => (
                                                                    <li key={pIdx} style={{ fontSize: '0.8rem' }}>{point}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default AiOptimizer;
