import { useState, useEffect } from 'react';
import { useCv } from '../../context/CvContext';
import { Plus, Trash2, Wand2, ChevronDown, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import './Editor.css';
import DownloadDropdown from './DownloadDropdown';
import AiOptimizer from './AiOptimizer';
import translations from '../../utils/translations';

const Editor = ({ showTooltip }) => {
    const [isAiOpen, setIsAiOpen] = useState(false);
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
        // Save original title
        const originalTitle = document.title;
        // Set title to person name for filename
        document.title = cvData.personal.name || 'CV';

        // Set print mode attribute to control visibility via CSS
        document.body.setAttribute('data-print-mode', option);

        // Trigger browser print
        window.print();

        // Restore original title and clear attribute
        setTimeout(() => {
            document.title = originalTitle;
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

    const lang = cvData.preferences?.language || 'en';
    const t = translations[lang];
    const isAr = lang === 'ar';

    return (
        <div className={`editor ${isAr ? 'rtl' : ''}`}>
            <div className="editor-header">
                <img src="/logo.svg" alt="CV Builder" className="editor-logo" id="tour-logo" />
                <div className="download-controls">
                    <div className="ai-btn-container" style={{ position: 'relative' }}>
                        <button
                            className="ai-trigger-btn"
                            id="tour-ai-btn"
                            onClick={() => {
                                setIsAiOpen(true);
                            }}
                        >
                            <img src="/logo.svg" alt="Pro" className="ai-btn-logo" />
                            <span>{t.pro}</span>
                        </button>
                        {showTooltip && (
                            <div className="ai-tooltip-pop">
                                <span>{t.optimizeAi}</span>
                            </div>
                        )}
                    </div>
                    <div id="tour-download">
                        <DownloadDropdown onExport={handleDownloadPDF} />
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <section className="editor-section" id="tour-editor-personal">
                <h2 className="editor-section-title">{t.personalInfo}</h2>
                <div className="form-group">
                    <label>{t.fullName}</label>
                    <input
                        id="tour-field-name"
                        type="text"
                        value={cvData.personal.name}
                        onChange={(e) => updatePersonal('name', e.target.value)}
                        placeholder={t.placeholderName}
                    />
                </div>
                <div className="form-group">
                    <label>{t.jobTitle}</label>
                    <input
                        id="tour-field-title"
                        type="text"
                        value={cvData.personal.title}
                        onChange={(e) => updatePersonal('title', e.target.value)}
                        placeholder={t.placeholderTitle}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>{t.email}</label>
                        <input
                            id="tour-field-email"
                            type="email"
                            value={cvData.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            placeholder={t.placeholderEmail}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.phone}</label>
                        <input
                            id="tour-field-phone"
                            type="tel"
                            value={cvData.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            placeholder={t.placeholderPhone}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>{t.location}</label>
                    <input
                        id="tour-field-address"
                        type="text"
                        value={cvData.personal.location || ''}
                        onChange={(e) => updatePersonal('location', e.target.value)}
                        placeholder={t.placeholderLocation}
                    />
                </div>

                {/* Social/Professional Links */}
                <div className="form-group" id="tour-links-container">
                    <div className="section-header" style={{ marginBottom: '0.5rem' }}>
                        <label style={{ marginBottom: 0 }}>{t.links}</label>
                        <button
                            id="tour-add-link"
                            className="add-btn"
                            onClick={addLink}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                        >
                            <Plus size={14} /> {t.addLink}
                        </button>
                    </div>
                    {(cvData.personal.links || []).map((link, index) => (
                        <div key={link.id} className="link-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                id={index === 0 ? "tour-link-label" : undefined}
                                type="text"
                                value={link.label}
                                onChange={(e) => updateLink(link.id, { label: e.target.value })}
                                placeholder={t.labelPlaceholder}
                                style={{ flex: 1 }}
                            />
                            <input
                                id={index === 0 ? "tour-link-url" : undefined}
                                type="text"
                                value={link.url}
                                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                                placeholder={t.urlPlaceholder}
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
                    <label>{t.summary}</label>
                    <textarea
                        id="tour-field-summary"
                        rows="4"
                        value={cvData.personal.summary}
                        onChange={(e) => updatePersonal('summary', e.target.value)}
                        placeholder={t.summaryPlaceholder}
                    />
                </div>
            </section>

            {/* Experience */}
            <section className="editor-section" id="tour-section-experience">
                <div className="section-header">
                    <h2 className="editor-section-title">{t.experience}</h2>
                    <button id="tour-add-experience" className="add-btn" onClick={handleAddExperience}>
                        <Plus size={16} /> {t.addExperience}
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
                                        <h3>{exp.position || `${t.experience} ${index + 1}`}</h3>
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
                                    <label>{t.position}</label>
                                    <input
                                        id={index === 0 ? "tour-exp-position" : undefined}
                                        type="text"
                                        value={exp.position}
                                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                                        placeholder={t.placeholderTitle}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t.company}</label>
                                        <input
                                            id={index === 0 ? "tour-exp-company" : undefined}
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                            placeholder={t.placeholderCompany}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t.location}</label>
                                        <input
                                            id={index === 0 ? "tour-exp-location" : undefined}
                                            type="text"
                                            value={exp.location}
                                            onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                                            placeholder={t.placeholderLocation}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t.startDate}</label>
                                        <input
                                            id={index === 0 ? "tour-exp-start" : undefined}
                                            type="text"
                                            value={exp.startDate}
                                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                            placeholder="Jan 2020"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t.endDate}</label>
                                        <input
                                            id={index === 0 ? "tour-exp-end" : undefined}
                                            type="text"
                                            value={exp.endDate}
                                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                            placeholder={lang === 'ar' ? 'الحالي' : 'Present'}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{t.responsibilities}</label>
                                    {exp.responsibilities.map((resp, idx) => (
                                        <div key={idx} className="responsibility-item">
                                            <input
                                                id={index === 0 && idx === 0 ? "tour-exp-description" : undefined}
                                                type="text"
                                                value={resp}
                                                onChange={(e) => handleResponsibilityChange(exp.id, idx, e.target.value)}
                                                placeholder={t.placeholderResponsibility}
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
                                        id={index === 0 ? "tour-add-responsibility" : undefined}
                                        className="add-secondary-btn"
                                        onClick={() => addResponsibility(exp.id)}
                                    >
                                        {t.addResponsibility}
                                    </button>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('experience', exp.id)}>
                                    {t.done}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Education */}
            <section className="editor-section" id="tour-section-education">
                <div className="section-header">
                    <h2 className="editor-section-title">{t.education}</h2>
                    <button id="tour-add-education" className="add-btn" onClick={handleAddEducation}>
                        <Plus size={16} /> {t.addEducation}
                    </button>
                </div>
                {cvData.education.map((edu, index) => {
                    const isExpanded = expandedItems.education === edu.id;
                    return (
                        <div key={edu.id} id={index === 0 ? "tour-edu-first" : undefined} className={`list-item ${isExpanded ? 'expanded' : ''}`} onClick={() => !isExpanded && toggleExpand('education', edu.id)}>
                            <div className="list-item-header">
                                <div className="list-item-header-content">
                                    {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                                    <div className="list-item-header-info">
                                        <h3>{edu.degree || `${t.education} ${index + 1}`}</h3>
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
                                    <label>{t.degree}</label>
                                    <input
                                        id={index === 0 ? "tour-edu-degree" : undefined}
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                        placeholder={t.placeholderDegree}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t.institution}</label>
                                        <input
                                            id={index === 0 ? "tour-edu-institution" : undefined}
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                                            placeholder={t.placeholderUniversity}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t.location}</label>
                                        <input
                                            id={index === 0 ? "tour-edu-location" : undefined}
                                            type="text"
                                            value={edu.location}
                                            onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                                            placeholder={t.placeholderLocation}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t.startYear}</label>
                                        <input
                                            id={index === 0 ? "tour-edu-start" : undefined}
                                            type="text"
                                            value={edu.startDate}
                                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                            placeholder="2012"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t.endYear}</label>
                                        <input
                                            id={index === 0 ? "tour-edu-end" : undefined}
                                            type="text"
                                            value={edu.endDate}
                                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                            placeholder="2016"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{t.description}</label>
                                    <textarea
                                        id={index === 0 ? "tour-edu-description" : undefined}
                                        rows="2"
                                        value={edu.description}
                                        onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                                        placeholder={t.placeholderGpa}
                                    />
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('education', edu.id)}>
                                    {t.done}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Skills */}
            <section className="editor-section" id="tour-section-skills">
                <h2 className="editor-section-title">{t.skills}</h2>
                <div className="form-group">
                    <label>{t.technicalSkills}</label>
                    <input
                        id="tour-skills-tech"
                        type="text"
                        value={cvData.skills.technical.join(', ')}
                        onChange={(e) =>
                            updateSkills('technical', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                        }
                        placeholder="JavaScript, React, Node.js, Python..."
                    />
                </div>
                <div className="form-group">
                    <label>{t.softSkills}</label>
                    <input
                        id="tour-skills-soft"
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
            <section className="editor-section" id="tour-section-certifications">
                <div className="section-header">
                    <h2 className="editor-section-title">{t.certifications}</h2>
                    <button id="tour-add-course" className="add-btn" onClick={handleAddCourse}>
                        <Plus size={16} /> {t.addCourse}
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
                                        <h3>{course.name || `${t.certifications} ${index + 1}`}</h3>
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
                                        <label>{t.courseName}</label>
                                        <input
                                            id={index === 0 ? "tour-course-name" : undefined}
                                            type="text"
                                            value={course.name}
                                            onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                                            placeholder={t.placeholderProject}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t.provider}</label>
                                        <input
                                            id={index === 0 ? "tour-course-provider" : undefined}
                                            type="text"
                                            value={course.provider}
                                            onChange={(e) => updateCourse(course.id, { provider: e.target.value })}
                                            placeholder={t.company}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t.year}</label>
                                        <input
                                            id={index === 0 ? "tour-course-year" : undefined}
                                            type="text"
                                            value={course.year}
                                            onChange={(e) => updateCourse(course.id, { year: e.target.value })}
                                            placeholder="2023"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t.hours}</label>
                                        <input
                                            id={index === 0 ? "tour-course-hours" : undefined}
                                            type="text"
                                            value={course.hours || ''}
                                            onChange={(e) => updateCourse(course.id, { hours: e.target.value })}
                                            placeholder="40h"
                                        />
                                    </div>
                                    <div className="form-group flex-2">
                                        <label>{t.certificateUrl}</label>
                                        <input
                                            id={index === 0 ? "tour-course-link" : undefined}
                                            type="text"
                                            value={course.link || ''}
                                            onChange={(e) => updateCourse(course.id, { link: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('courses', course.id)}>
                                    {t.done}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Projects */}
            <section className="editor-section" id="tour-section-projects">
                <div className="section-header">
                    <h2 className="editor-section-title">{t.projects}</h2>
                    <button id="tour-add-project" className="add-btn" onClick={handleAddProject}>
                        <Plus size={16} /> {t.addProject}
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
                                        <h3>{project.name || `${t.projects} ${index + 1}`}</h3>
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
                                    <label>{t.projectName}</label>
                                    <input
                                        id={index === 0 ? "tour-project-name" : undefined}
                                        type="text"
                                        value={project.name}
                                        onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                        placeholder={t.placeholderProject}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t.projectUrl}</label>
                                    <input
                                        id={index === 0 ? "tour-project-link" : undefined}
                                        type="text"
                                        value={project.link}
                                        onChange={(e) => updateProject(project.id, { link: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t.description} (max 40 characters)</label>
                                    <textarea
                                        id={index === 0 ? "tour-project-description" : undefined}
                                        rows="2"
                                        maxLength={40}
                                        value={project.description || ''}
                                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                        placeholder={t.placeholderProjectDesc}
                                    />
                                    <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                        {project.description?.length || 0}/40 characters
                                    </small>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('projects', project.id)}>
                                    {t.done}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Extracurricular Activities */}
            <section className="editor-section" id="tour-section-activities">
                <div className="section-header">
                    <h2 className="editor-section-title">{t.activities}</h2>
                    <button id="tour-add-activity" className="add-btn" onClick={handleAddActivity}>
                        <Plus size={16} /> {t.addActivity}
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
                                        <h3>{activity.name || `${t.activities} ${index + 1}`}</h3>
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
                                    <label>{t.orgEvent}</label>
                                    <input
                                        id={index === 0 ? "tour-activity-name" : undefined}
                                        type="text"
                                        value={activity.name}
                                        onChange={(e) => updateActivity(activity.id, { name: e.target.value })}
                                        placeholder={t.placeholderActivity}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t.role}</label>
                                    <input
                                        id={index === 0 ? "tour-activity-role" : undefined}
                                        type="text"
                                        value={activity.role}
                                        onChange={(e) => updateActivity(activity.id, { role: e.target.value })}
                                        placeholder={t.placeholderRole}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t.description}</label>
                                    <textarea
                                        id={index === 0 ? "tour-activity-description" : undefined}
                                        rows="3"
                                        value={activity.description}
                                        onChange={(e) => updateActivity(activity.id, { description: e.target.value })}
                                        placeholder={t.placeholderActivityDesc}
                                    />
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('activities', activity.id)}>
                                    {t.done}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Languages */}
            <section className="editor-section" id="tour-section-languages">
                <div className="section-header">
                    <h2 className="editor-section-title">{t.languages}</h2>
                    <button id="tour-add-language" className="add-btn" onClick={handleAddLanguage}>
                        <Plus size={16} /> {t.addLanguage}
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
                                        <h3>{lang.name || `${t.languages} ${index + 1}`}</h3>
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
                                        <label>{t.languageName}</label>
                                        <input
                                            type="text"
                                            value={lang.name}
                                            onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                                            placeholder={t.placeholderLanguage}
                                        />
                                    </div>
                                    <div className="form-group focus-within:ring-2">
                                        <label>{t.level}</label>
                                        <select
                                            className="focus:ring-2 focus:ring-blue-500"
                                            value={lang.level}
                                            onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
                                        >
                                            <option value="Native">{t.levels.native}</option>
                                            <option value="Fluent">{t.levels.fluent}</option>
                                            <option value="Professional">{t.levels.pro}</option>
                                            <option value="Intermediate">{t.levels.intermediate}</option>
                                            <option value="Basic">{t.levels.basic}</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="done-btn" onClick={() => toggleExpand('languages', lang.id)}>
                                    {t.done}
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
