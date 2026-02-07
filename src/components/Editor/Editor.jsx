import { useState, useEffect } from 'react';
import { useCv } from '../../context/CvContext';
import { Plus, Trash2, Wand2, ChevronDown, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import './Editor.css';
import DownloadDropdown from './DownloadDropdown';
import AiOptimizer from './AiOptimizer';

const Editor = () => {

    const [isAiOpen, setIsAiOpen] = useState(false);
    const [showAiTooltip, setShowAiTooltip] = useState(false);
    const [expandedItems, setExpandedItems] = useState({
        experience: null,
        education: null,
        courses: null,
        projects: null,
        activities: null,
        languages: null
    });

    const toggleExpand = (section, id) => {
        setExpandedItems(prev => ({
            ...prev,
            [section]: prev[section] === id ? null : id
        }));
    };

    useEffect(() => {
        // Show tooltip on load after a short delay
        const showTimer = setTimeout(() => {
            setShowAiTooltip(true);

            // Auto-hide after 7 seconds as requested
            const hideTimer = setTimeout(() => {
                setShowAiTooltip(false);
            }, 3000);

            return () => clearTimeout(hideTimer);
        }, 1500);

        return () => clearTimeout(showTimer);
    }, []);


    const {
        cvData,
        updatePersonal,
        updateEducation,
        addEducation,
        removeEducation,
        updateExperience,
        addExperience,
        removeExperience,
        updateSkills,
        addCourse,
        updateCourse,
        removeCourse,
        addLink,
        updateLink,
        removeLink,
        addProject,
        updateProject,
        removeProject,
        addActivity,
        updateActivity,
        removeActivity,
        addLanguage,
        updateLanguage,
        removeLanguage,
        updatePreferences,
    } = useCv();

    const handleDownloadPDF = async (option = 'all') => {
        // Set print mode attribute to control visibility via CSS
        document.body.setAttribute('data-print-mode', option);

        // Trigger browser print
        window.print();

        // Clear attribute after a short delay (optional, but good for cleanup)
        setTimeout(() => {
            document.body.removeAttribute('data-print-mode');
        }, 1000);

    };

    const page2Sections = cvData.sections?.page2 || ['activities', 'courses', 'skills'];
    const isSectionActive = (sectionId) => {
        switch (sectionId) {
            case 'summary': return !!cvData.personal.summary;
            case 'education': return cvData.education.length > 0;
            case 'experience': return cvData.experience.length > 0;
            case 'projects': return (cvData.projects || []).length > 0;
            case 'activities': return (cvData.activities || []).length > 0;
            case 'courses': return cvData.courses.length > 0;
            case 'skills': return (cvData.skills?.technical?.length > 0 || cvData.skills?.soft?.length > 0);
            default: return false;
        }
    };
    const isPage2Active = page2Sections.some(isSectionActive);
    const targetPageLabel = isPage2Active ? 'Page 2' : 'Page 1';

    const handleResponsibilityChange = (expId, index, value) => {
        const exp = cvData.experience.find(e => e.id === expId);
        const newResponsibilities = [...exp.responsibilities];
        newResponsibilities[index] = value;
        updateExperience(expId, { responsibilities: newResponsibilities });
    };

    const addResponsibility = (expId) => {
        const exp = cvData.experience.find(e => e.id === expId);
        updateExperience(expId, { responsibilities: [...exp.responsibilities, ''] });
    };

    const removeResponsibility = (expId, index) => {
        const exp = cvData.experience.find(e => e.id === expId);
        const newResponsibilities = exp.responsibilities.filter((_, i) => i !== index);
        updateExperience(expId, { responsibilities: newResponsibilities });
    };

    const handleAddExperience = () => {
        addExperience();
        // The new ID will be the length of current + 1 (simple logic as per context)
        const nextId = Math.max(...cvData.experience.map(e => e.id), 0) + 1;
        setExpandedItems(prev => ({ ...prev, experience: nextId }));
    };

    const handleAddEducation = () => {
        addEducation();
        const nextId = Math.max(...cvData.education.map(e => e.id), 0) + 1;
        setExpandedItems(prev => ({ ...prev, education: nextId }));
    };

    const handleAddProject = () => {
        addProject();
        const nextId = Math.max(...(cvData.projects || []).map(p => p.id), 0) + 1;
        setExpandedItems(prev => ({ ...prev, projects: nextId }));
    };

    const handleAddActivity = () => {
        addActivity();
        const nextId = Math.max(...(cvData.activities || []).map(a => a.id), 0) + 1;
        setExpandedItems(prev => ({ ...prev, activities: nextId }));
    };

    const handleAddCourse = () => {
        addCourse();
        const nextId = Math.max(...(cvData.courses || []).map(c => c.id), 0) + 1;
        setExpandedItems(prev => ({ ...prev, courses: nextId }));
    };

    const handleAddLanguage = () => {
        const newId = Date.now();
        addLanguage(newId);
        setExpandedItems(prev => ({ ...prev, languages: newId }));
    };

    return (
        <div className="editor">
            <div className="editor-header">
                <img src="/logo.svg" alt="CV Builder" className="editor-logo" />
                <div className="download-controls">
                    <div className="ai-btn-container" style={{ position: 'relative' }}>
                        <button
                            className="ai-trigger-btn"
                            onClick={() => {
                                setIsAiOpen(true);
                                setShowAiTooltip(false);
                            }}
                        >
                            <img src="/logo.svg" alt="Pro" className="ai-btn-logo" />
                            <span>Pro</span>
                        </button>
                        {showAiTooltip && (
                            <div className="ai-tooltip-pop">
                                <span>Optimize with AI ✨</span>
                            </div>
                        )}
                    </div>
                    <DownloadDropdown onExport={handleDownloadPDF} />
                </div>
            </div>

            {/* Personal Information */}
            <section className="editor-section">
                <h2 className="editor-section-title">Personal Information</h2>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={cvData.personal.name}
                        onChange={(e) => updatePersonal('name', e.target.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div className="form-group">
                    <label>Job Title</label>
                    <input
                        type="text"
                        value={cvData.personal.title}
                        onChange={(e) => updatePersonal('title', e.target.value)}
                        placeholder="Senior Software Engineer"
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={cvData.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            placeholder="john.doe@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            value={cvData.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        value={cvData.personal.location || ''}
                        onChange={(e) => updatePersonal('location', e.target.value)}
                        placeholder="Giza"
                    />
                </div>

                {/* Social/Professional Links */}
                <div className="form-group">
                    <div className="section-header" style={{ marginBottom: '0.5rem' }}>
                        <label style={{ marginBottom: 0 }}>Links</label>
                        <button
                            className="add-btn"
                            onClick={addLink}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                        >
                            <Plus size={14} /> Add Link
                        </button>
                    </div>
                    {(cvData.personal.links || []).map((link) => (
                        <div key={link.id} className="link-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={link.label}
                                onChange={(e) => updateLink(link.id, { label: e.target.value })}
                                placeholder="Label (e.g. LinkedIn)"
                                style={{ flex: 1 }}
                            />
                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                                placeholder="URL"
                                style={{ flex: 2 }}
                            />
                            <button
                                className="delete-btn"
                                onClick={() => removeLink(link.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="form-group">
                    <label>Professional Summary</label>
                    <textarea
                        rows="4"
                        value={cvData.personal.summary}
                        onChange={(e) => updatePersonal('summary', e.target.value)}
                        placeholder="Brief professional summary..."
                    />
                </div>
            </section>

            {/* Experience */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Experience</h2>
                    <button className="add-btn" onClick={handleAddExperience}>
                        <Plus size={16} /> Add Experience
                    </button>
                </div>
                {cvData.experience.map((exp, index) => {
                    const isExpanded = expandedItems.experience === exp.id;
                    return (
                        <div key={exp.id} className={`list-item ${isExpanded ? 'expanded' : ''}`} onClick={() => !isExpanded && toggleExpand('experience', exp.id)}>
                            <div className="list-item-header">
                                <div className="list-item-header-content">
                                    {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                                    <div className="list-item-header-info">
                                        <h3>{exp.position || `Experience ${index + 1}`}</h3>
                                        {!isExpanded && exp.company && (
                                            <span className="list-item-header-subtitle">
                                                {exp.company} {exp.startDate && `• ${exp.startDate}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeExperience(exp.id);
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="list-item-body">
                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        value={exp.position}
                                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                                        placeholder="Software Engineer"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                            placeholder="Company Name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            value={exp.location}
                                            onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="text"
                                            value={exp.startDate}
                                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                            placeholder="Jan 2020"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="text"
                                            value={exp.endDate}
                                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                            placeholder="Present"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Responsibilities</label>
                                    {exp.responsibilities.map((resp, idx) => (
                                        <div key={idx} className="responsibility-item">
                                            <input
                                                type="text"
                                                value={resp}
                                                onChange={(e) => handleResponsibilityChange(exp.id, idx, e.target.value)}
                                                placeholder="Responsibility"
                                            />
                                            {exp.responsibilities.length > 1 && (
                                                <button
                                                    className="delete-icon-btn"
                                                    onClick={() => removeResponsibility(exp.id, idx)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        className="add-secondary-btn"
                                        onClick={() => addResponsibility(exp.id)}
                                    >
                                        + Add Responsibility
                                    </button>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('experience', exp.id)}>
                                    Done
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Education */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Education</h2>
                    <button className="add-btn" onClick={handleAddEducation}>
                        <Plus size={16} /> Add Education
                    </button>
                </div>
                {cvData.education.map((edu, index) => {
                    const isExpanded = expandedItems.education === edu.id;
                    return (
                        <div key={edu.id} className={`list-item ${isExpanded ? 'expanded' : ''}`} onClick={() => !isExpanded && toggleExpand('education', edu.id)}>
                            <div className="list-item-header">
                                <div className="list-item-header-content">
                                    {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                                    <div className="list-item-header-info">
                                        <h3>{edu.degree || `Education ${index + 1}`}</h3>
                                        {!isExpanded && edu.institution && (
                                            <span className="list-item-header-subtitle">
                                                {edu.institution} {edu.startDate && `• ${edu.startDate}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeEducation(edu.id);
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="list-item-body">
                                <div className="form-group">
                                    <label>Degree</label>
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                        placeholder="Bachelor of Science in Computer Science"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Institution</label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                                            placeholder="University Name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            value={edu.location}
                                            onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Year</label>
                                        <input
                                            type="text"
                                            value={edu.startDate}
                                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                            placeholder="2012"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Year</label>
                                        <input
                                            type="text"
                                            value={edu.endDate}
                                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                            placeholder="2016"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        rows="2"
                                        value={edu.description}
                                        onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                                        placeholder="GPA, relevant coursework, honors..."
                                    />
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('education', edu.id)}>
                                    Done
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Skills */}
            <section className="editor-section">
                <h2 className="editor-section-title">Skills</h2>
                <div className="form-group">
                    <label>Technical Skills (comma-separated)</label>
                    <input
                        type="text"
                        value={cvData.skills.technical.join(', ')}
                        onChange={(e) =>
                            updateSkills('technical', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                        }
                        placeholder="JavaScript, React, Node.js, Python..."
                    />
                </div>
                <div className="form-group">
                    <label>Soft Skills (comma-separated)</label>
                    <input
                        type="text"
                        value={cvData.skills.soft.join(', ')}
                        onChange={(e) =>
                            updateSkills('soft', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                        }
                        placeholder="Leadership, Communication, Problem Solving..."
                    />
                </div>
            </section>

            {/* Courses & Certifications */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Certifications & Courses</h2>
                    <button className="add-btn" onClick={handleAddCourse}>
                        <Plus size={16} /> Add Course
                    </button>
                </div>
                {(cvData.courses || []).map((course, index) => {
                    const isExpanded = expandedItems.courses === course.id;
                    return (
                        <div key={course.id} className={`list-item-compact ${isExpanded ? 'expanded' : ''}`} onClick={() => !isExpanded && toggleExpand('courses', course.id)}>
                            <div className="list-item-header">
                                <div className="list-item-header-content">
                                    {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                                    <div className="list-item-header-info">
                                        <h3>{course.name || `Certification ${index + 1}`}</h3>
                                        {!isExpanded && course.provider && (
                                            <span className="list-item-header-subtitle">
                                                {course.provider} {course.year && `• ${course.year}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeCourse(course.id);
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="list-item-body">
                                <div className="form-row">
                                    <div className="form-group flex-2">
                                        <label>Course/Certification Name</label>
                                        <input
                                            type="text"
                                            value={course.name}
                                            onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                                            placeholder="AWS Certified Solutions Architect"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Provider</label>
                                        <input
                                            type="text"
                                            value={course.provider}
                                            onChange={(e) => updateCourse(course.id, { provider: e.target.value })}
                                            placeholder="Amazon Web Services"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Year</label>
                                        <input
                                            type="text"
                                            value={course.year}
                                            onChange={(e) => updateCourse(course.id, { year: e.target.value })}
                                            placeholder="2023"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Hours</label>
                                        <input
                                            type="text"
                                            value={course.hours || ''}
                                            onChange={(e) => updateCourse(course.id, { hours: e.target.value })}
                                            placeholder="40h"
                                        />
                                    </div>
                                    <div className="form-group flex-2">
                                        <label>Certificate URL</label>
                                        <input
                                            type="text"
                                            value={course.link || ''}
                                            onChange={(e) => updateCourse(course.id, { link: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('courses', course.id)}>
                                    Done
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Projects */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Projects</h2>
                    <button className="add-btn" onClick={handleAddProject}>
                        <Plus size={16} /> Add Project
                    </button>
                </div>
                {(cvData.projects || []).map((project, index) => {
                    const isExpanded = expandedItems.projects === project.id;
                    return (
                        <div key={project.id} className={`list-item ${isExpanded ? 'expanded' : ''}`} onClick={() => !isExpanded && toggleExpand('projects', project.id)}>
                            <div className="list-item-header">
                                <div className="list-item-header-content">
                                    {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                                    <div className="list-item-header-info">
                                        <h3>{project.name || `Project ${index + 1}`}</h3>
                                        {!isExpanded && project.link && <span className="list-item-header-subtitle">{project.link}</span>}
                                    </div>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeProject(project.id);
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="list-item-body">
                                <div className="form-group">
                                    <label>Project Name</label>
                                    <input
                                        type="text"
                                        value={project.name}
                                        onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                        placeholder="E-Commerce Website"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Project URL</label>
                                    <input
                                        type="text"
                                        value={project.link}
                                        onChange={(e) => updateProject(project.id, { link: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description (max 40 characters)</label>
                                    <textarea
                                        rows="2"
                                        maxLength={40}
                                        value={project.description || ''}
                                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                        placeholder="Brief description of the project..."
                                    />
                                    <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                        {project.description?.length || 0}/40 characters
                                    </small>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('projects', project.id)}>
                                    Done
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Extracurricular Activities */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Extracurricular Activities</h2>
                    <button className="add-btn" onClick={handleAddActivity}>
                        <Plus size={16} /> Add Activity
                    </button>
                </div>
                {(cvData.activities || []).map((activity, index) => {
                    const isExpanded = expandedItems.activities === activity.id;
                    return (
                        <div key={activity.id} className={`list-item ${isExpanded ? 'expanded' : ''}`} onClick={() => !isExpanded && toggleExpand('activities', activity.id)}>
                            <div className="list-item-header">
                                <div className="list-item-header-content">
                                    {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                                    <div className="list-item-header-info">
                                        <h3>{activity.name || `Activity ${index + 1}`}</h3>
                                        {!isExpanded && activity.role && <span className="list-item-header-subtitle">{activity.role}</span>}
                                    </div>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeActivity(activity.id);
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="list-item-body">
                                <div className="form-group">
                                    <label>Organization / Event</label>
                                    <input
                                        type="text"
                                        value={activity.name}
                                        onChange={(e) => updateActivity(activity.id, { name: e.target.value })}
                                        placeholder="Maker Faire Cairo '19"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <input
                                        type="text"
                                        value={activity.role}
                                        onChange={(e) => updateActivity(activity.id, { role: e.target.value })}
                                        placeholder="Photographer Volunteer"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        rows="3"
                                        value={activity.description}
                                        onChange={(e) => updateActivity(activity.id, { description: e.target.value })}
                                        placeholder="Describe your responsibilities or achievements..."
                                    />
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('activities', activity.id)}>
                                    Done
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Languages */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Languages</h2>
                    <button className="add-btn" onClick={handleAddLanguage}>
                        <Plus size={16} /> Add Language
                    </button>
                </div>
                {(cvData.languages || []).map((lang, index) => {
                    const isExpanded = expandedItems.languages === lang.id;
                    return (
                        <div key={lang.id} className={`list-item-compact ${isExpanded ? 'expanded' : ''}`} onClick={() => !isExpanded && toggleExpand('languages', lang.id)}>
                            <div className="list-item-header">
                                <div className="list-item-header-content">
                                    {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                                    <div className="list-item-header-info">
                                        <h3>{lang.name || `Language ${index + 1}`}</h3>
                                        {!isExpanded && lang.level && <span className="list-item-header-subtitle">{lang.level}</span>}
                                    </div>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeLanguage(lang.id);
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="list-item-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Language</label>
                                        <input
                                            type="text"
                                            value={lang.name}
                                            onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                                            placeholder="English"
                                        />
                                    </div>
                                    <div className="form-group focus-within:ring-2">
                                        <label>Level</label>
                                        <select
                                            className="focus:ring-2 focus:ring-blue-500"
                                            value={lang.level}
                                            onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
                                        >
                                            <option value="Native">Native</option>
                                            <option value="Fluent">Fluent</option>
                                            <option value="Professional">Professional</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Basic">Basic</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('languages', lang.id)}>
                                    Done
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>



            <AiOptimizer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </div>
    );
};

export default Editor;
