import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useCv } from '../../context/CvContext';
import './A4Page.css';

// Dummy Data for Placeholder Preview
const DUMMY_DATA = {
    personal: {
        name: 'John Doe',
        title: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Giza',
        summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.',
        links: [
            { id: 1, label: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
            { id: 2, label: 'Portfolio', url: 'https://johndoe.dev' },
        ],
    },
    education: [
        {
            id: 1,
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            startDate: '2012',
            endDate: '2016',
            description: 'GPA: 3.8/4.0. Relevant coursework: Data Structures, Algorithms, Database Systems, Web Development',
        },
    ],
    experience: [
        {
            id: 1,
            position: 'Senior Software Engineer',
            company: 'Tech Corp Inc.',
            location: 'San Francisco, CA',
            startDate: 'Jan 2020',
            endDate: 'Present',
            responsibilities: [
                'Lead development of microservices architecture serving 10M+ users',
                'Mentor junior developers and conduct code reviews',
                'Reduced API response time by 40% through optimization',
                'Implemented CI/CD pipelines reducing deployment time by 60%',
            ],
        },
        {
            id: 2,
            position: 'Software Engineer',
            company: 'StartUp Solutions',
            location: 'San Francisco, CA',
            startDate: 'Jun 2016',
            endDate: 'Dec 2019',
            responsibilities: [
                'Developed full-stack web applications using React and Node.js',
                'Collaborated with designers to implement responsive UI/UX',
                'Integrated third-party APIs and payment systems',
            ],
        },
    ],
    skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'],
        soft: ['Leadership', 'Problem Solving', 'Communication', 'Agile Development'],
    },
    courses: [
        {
            id: 1,
            name: 'AWS Certified Solutions Architect',
            provider: 'Amazon Web Services',
            year: '2022',
            hours: '40h',
            link: 'https://aws.amazon.com/certification/',
        },
    ],
    projects: [
        {
            id: 1,
            name: 'E-Commerce Platform',
            description: 'Built a full-featured e-commerce site with React and Node.js.',
            link: 'https://github.com/johndoe/ecommerce',
        }
    ],
    activities: [
        {
            id: 1,
            name: 'Tech Community Volunteer',
            role: 'Event Organizer',
            description: 'Organized monthly meetups for local developers.',
        }
    ],
};

// Section Component with Arrow Controls
const CvSection = ({ id, children, onMoveUp, onMoveDown, isFirst, isLast }) => {
    return (
        <div className="cv-section">
            <div className="section-controls no-print">
                <button
                    onClick={onMoveUp}
                    disabled={isFirst}
                    className="control-btn"
                    title="Move Up"
                >
                    <ArrowUp size={14} />
                </button>
                <button
                    onClick={onMoveDown}
                    disabled={isLast}
                    className="control-btn"
                    title="Move Down"
                >
                    <ArrowDown size={14} />
                </button>
            </div>
            {children}
        </div>
    );
};

const A4Page = () => {
    const { cvData } = useCv();
    const [pageWarning, setPageWarning] = useState(false);

    // Determine Data to Display (Real vs Dummy)
    const hasPersonalData = cvData.personal.name || cvData.personal.title || cvData.personal.email || cvData.personal.phone || cvData.personal.summary;

    // Create the display object merging real and dummy data logic
    const displayData = {
        personal: hasPersonalData ? cvData.personal : DUMMY_DATA.personal,
        education: cvData.education.length > 0 ? cvData.education : DUMMY_DATA.education,
        experience: cvData.experience.length > 0 ? cvData.experience : DUMMY_DATA.experience,
        skills: (cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0) ? cvData.skills : DUMMY_DATA.skills,
        courses: cvData.courses.length > 0 ? cvData.courses : DUMMY_DATA.courses,
        projects: (cvData.projects && cvData.projects.length > 0) ? cvData.projects : DUMMY_DATA.projects,
        activities: (cvData.activities && cvData.activities.length > 0) ? cvData.activities : DUMMY_DATA.activities,
    };

    // Split sections between two pages
    const [page1Sections, setPage1Sections] = useState([
        'summary',
        'education',
        'experience',
        'projects',
    ]);

    const [page2Sections, setPage2Sections] = useState([
        'activities',
        'courses',
        'skills',
    ]);

    // Responsive Scaling Logic
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            let containerWidth;
            if (window.innerWidth < 1024) {
                // On mobile/tablet, use window width directly as container might be transitioning or unstable
                containerWidth = window.innerWidth;
            } else {
                containerWidth = document.querySelector('.preview-container')?.offsetWidth || window.innerWidth;
            }

            // 210mm is approx 794px. We add some padding buffer.
            const targetWidth = 830;
            // Subtract more padding (48px) on mobile to ensure no cutoff
            const padding = window.innerWidth < 768 ? 48 : 32;
            const availableWidth = Math.max(0, containerWidth - padding);

            const newScale = Math.min(1, availableWidth / targetWidth);
            setScale(newScale);
        };

        // Small delay to ensure layout is ready
        setTimeout(handleResize, 100);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const moveSection = (sectionId, direction) => {
        const inPage1 = page1Sections.includes(sectionId);
        const inPage2 = page2Sections.includes(sectionId);

        if (inPage1) {
            const index = page1Sections.indexOf(sectionId);
            if (direction === 'up') {
                if (index > 0) {
                    // Move up within Page 1
                    const newSections = [...page1Sections];
                    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
                    setPage1Sections(newSections);
                }
            } else {
                if (index < page1Sections.length - 1) {
                    // Move down within Page 1
                    const newSections = [...page1Sections];
                    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                    setPage1Sections(newSections);
                } else {
                    // Move to Page 2 (Top)
                    setPage1Sections(page1Sections.filter(id => id !== sectionId));
                    setPage2Sections([sectionId, ...page2Sections]);
                }
            }
        } else if (inPage2) {
            const index = page2Sections.indexOf(sectionId);
            if (direction === 'up') {
                if (index > 0) {
                    // Move up within Page 2
                    const newSections = [...page2Sections];
                    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
                    setPage2Sections(newSections);
                } else {
                    // Move to Page 1 (Bottom)
                    setPage2Sections(page2Sections.filter(id => id !== sectionId));
                    setPage1Sections([...page1Sections, sectionId]);
                }
            } else {
                if (index < page2Sections.length - 1) {
                    // Move down within Page 2
                    const newSections = [...page2Sections];
                    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                    setPage2Sections(newSections);
                }
            }
        }
    };

    // Section renderers
    const renderSection = (sectionId, index, totalItems, pageNum) => {
        let isFirst = false;
        let isLast = false;

        if (pageNum === 1) {
            if (index === 0) isFirst = true;
        } else {
            if (index === totalItems - 1) isLast = true;
        }

        const content = (() => {
            switch (sectionId) {
                case 'summary':
                    return displayData.personal.summary ? (
                        <>
                            <h2 className="section-title">Professional Summary</h2>
                            <p className="summary-text">{displayData.personal.summary}</p>
                        </>
                    ) : null;

                case 'education':
                    return displayData.education.length > 0 ? (
                        <>
                            <h2 className="section-title">Education</h2>
                            {displayData.education.map(edu => (
                                <div key={edu.id} className="education-item">
                                    <div className="edu-header">
                                        <span className="edu-degree">{edu.degree}</span>
                                        {edu.institution && (
                                            <>
                                                {', '}
                                                <span className="edu-institution">{edu.institution}</span>
                                            </>
                                        )}
                                        {(edu.startDate || edu.endDate) && (
                                            <span className="edu-date">
                                                ({edu.startDate}{edu.startDate && edu.endDate && ' – '}{edu.endDate})
                                            </span>
                                        )}
                                    </div>
                                    {edu.location && (
                                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '0.125rem 0' }}>
                                            {edu.location}
                                        </p>
                                    )}
                                    {edu.description && <p className="edu-description">{edu.description}</p>}
                                </div>
                            ))}
                        </>
                    ) : null;

                case 'experience':
                    return displayData.experience.length > 0 ? (
                        <>
                            <h2 className="section-title">Experience</h2>
                            {displayData.experience.map(exp => (
                                <div key={exp.id} className="experience-item">
                                    <div className="exp-header">
                                        <span className="exp-position">{exp.position}</span>
                                        {exp.company && (
                                            <>
                                                {' at '}
                                                <span className="exp-company">{exp.company}</span>
                                            </>
                                        )}
                                        {(exp.startDate || exp.endDate) && (
                                            <span className="exp-date">
                                                ({exp.startDate}{exp.startDate && exp.endDate && ' – '}{exp.endDate})
                                            </span>
                                        )}
                                    </div>
                                    {exp.location && (
                                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '0.125rem 0' }}>
                                            {exp.location}
                                        </p>
                                    )}
                                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                                        <ul className="exp-responsibilities">
                                            {exp.responsibilities.map((resp, idx) => (
                                                resp && <li key={idx}>{resp}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : null;

                case 'courses':
                    return displayData.courses.length > 0 ? (
                        <>
                            <h2 className="section-title">Certifications & Courses</h2>
                            {displayData.courses.map(course => (
                                <div key={course.id} className="course-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingLeft: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                        <span style={{ marginRight: '0.5rem', fontSize: '10px', lineHeight: '0' }}>●</span>
                                        <span>
                                            <span className="course-name" style={{ fontWeight: 'bold' }}>
                                                {course.link ? (
                                                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="cv-link">
                                                        {course.name}
                                                    </a>
                                                ) : (
                                                    course.name
                                                )}
                                            </span>
                                            {course.provider && <span className="course-provider"> - {course.provider}</span>}
                                            {course.hours && <span className="course-hours"> | {course.hours}</span>}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
                                        {course.year && <span className="course-year">({course.year})</span>}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : null;

                case 'skills':
                    return (displayData.skills.technical.length > 0 || displayData.skills.soft.length > 0) ? (
                        <>
                            <h2 className="section-title">Key Skills</h2>
                            {displayData.skills.technical.length > 0 && (
                                <div className="skills-group">
                                    <span className="skills-label">Technical skills:</span>
                                    {displayData.skills.technical.map((skill, idx) => (
                                        <span key={idx} className="skills-list">{skill}</span>
                                    ))}
                                </div>
                            )}
                            {displayData.skills.soft.length > 0 && (
                                <div className="skills-group">
                                    <span className="skills-label">Soft skills:</span>
                                    {displayData.skills.soft.map((skill, idx) => (
                                        <span key={idx} className="skills-list">{skill}</span>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : null;

                case 'projects':
                    return (displayData.projects && displayData.projects.length > 0) ? (
                        <>
                            <h2 className="section-title">Projects</h2>
                            {displayData.projects.map(project => (
                                <div key={project.id} className="project-item">
                                    <div style={{ fontWeight: 'bold' }}>
                                        {project.name}
                                        {project.link && (
                                            <>
                                                {' - '}
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="cv-link">
                                                    {project.link}
                                                </a>
                                            </>
                                        )}
                                    </div>
                                    {project.description && <p>{project.description}</p>}
                                </div>
                            ))}
                        </>
                    ) : null;

                case 'activities':
                    return (displayData.activities && displayData.activities.length > 0) ? (
                        <>
                            <h2 className="section-title">Extracurricular Activities</h2>
                            {displayData.activities.map(activity => (
                                <div key={activity.id} className="activity-item">
                                    <div>{activity.name}</div>
                                    {activity.role && <div>{activity.role}</div>}
                                </div>
                            ))}
                        </>
                    ) : null;

                default:
                    return null;
            }
        })();

        return content ? (
            <CvSection
                key={sectionId}
                id={sectionId}
                onMoveUp={() => moveSection(sectionId, 'up')}
                onMoveDown={() => moveSection(sectionId, 'down')}
                isFirst={isFirst}
                isLast={isLast}
            >
                {content}
            </CvSection>
        ) : null;
    };

    // Render header with correct data source
    const renderHeader = () => (
        <header className="cv-header">
            <h1 className="cv-name">{displayData.personal.name}</h1>
            <div className="cv-contact">
                {displayData.personal.phone && <span>{displayData.personal.phone}</span>}
                {displayData.personal.phone && displayData.personal.email && <span className="separator"> – </span>}
                {displayData.personal.email && <span>{displayData.personal.email}</span>}
                {(displayData.personal.phone || displayData.personal.email) && displayData.personal.location && <span className="separator"> - </span>}
                {displayData.personal.location && <span>{displayData.personal.location}</span>}
            </div>

            {displayData.personal.links && displayData.personal.links.length > 0 && (
                <div className="cv-links">
                    {displayData.personal.links.map((link, idx) => (
                        <span key={link.id}>
                            {idx > 0 && <span className="separator-dot"> • </span>}
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="cv-link">
                                {link.label}
                            </a>
                        </span>
                    ))}
                </div>
            )}
        </header>
    );

    return (
        <div className="a4-container">
            {pageWarning && (
                <div className="page-warning no-print">
                    ⚠️ Content exceeds recommended limits. Consider reducing content.
                </div>
            )}

            <div
                className="a4-pages-wrapper"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    // Compensate for the space lost by scaling down
                    marginBottom: `-${(1 - scale) * 100}%`
                }}
            >
                {/* Page 1 */}
                <div>
                    <div className="a4-page" id="cv-content">
                        {renderHeader()}
                        {page1Sections.map((sectionId, index) =>
                            renderSection(sectionId, index, page1Sections.length, 1)
                        )}
                        {cvData.preferences?.referencesPage === 'page1' && (
                            <div className="references-section">
                                <p className="references-text">References available upon request</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page 2 */}
                <div>
                    <div className="a4-page" id="cv-page-2">
                        {page2Sections.map((sectionId, index) =>
                            renderSection(sectionId, index, page2Sections.length, 2)
                        )}
                        {page2Sections.length === 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: '#9ca3af',
                                fontStyle: 'italic',
                                fontSize: '0.875rem'
                            }}>
                                Content can be moved here
                            </div>
                        )}
                        {cvData.preferences?.referencesPage === 'page2' && (
                            <div className="references-section">
                                <p className="references-text">References available upon request</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default A4Page;
