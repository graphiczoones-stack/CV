import { useCv } from '../../context/CvContext';
import { Plus, Trash2 } from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExport';
import Swal from 'sweetalert2';
import './Editor.css';
import DownloadDropdown from './DownloadDropdown';

const Editor = () => {
    const handleDownloadPDF = async (option) => {
        if (option) {
            await exportToPDF(option, 'My_CV.pdf');

            // Show SweetAlert popup after download
            Swal.fire({
                title: 'Check ATS Score',
                text: 'Optimize your CV for Applicant Tracking Systems to maximize your hireability.',
                imageUrl: '/logo.svg',
                imageWidth: 80,
                imageAlt: 'Logo',
                showCancelButton: true,
                confirmButtonText: 'Check on JobScan',
                cancelButtonText: 'Maybe Later',
                confirmButtonColor: '#2563eb', // Site's primary blue
                customClass: {
                    popup: 'premium-popup',
                    confirmButton: 'swal-confirm-btn',
                    cancelButton: 'swal-cancel-btn'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    window.open('https://www.jobscan.co', '_blank');
                }
            });
        }
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
        updatePreferences,
    } = useCv();

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

    return (
        <div className="editor">
            <div className="editor-header">
                <img src="/logo.svg" alt="CV Builder" className="editor-logo" />
                <div className="download-controls">
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
                    <button className="add-btn" onClick={addExperience}>
                        <Plus size={16} /> Add Experience
                    </button>
                </div>
                {cvData.experience.map((exp) => (
                    <div key={exp.id} className="list-item">
                        <div className="list-item-header">
                            <h3>Position {exp.id}</h3>
                            <button
                                className="delete-btn"
                                onClick={() => removeExperience(exp.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
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
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Education</h2>
                    <button className="add-btn" onClick={addEducation}>
                        <Plus size={16} /> Add Education
                    </button>
                </div>
                {cvData.education.map((edu) => (
                    <div key={edu.id} className="list-item">
                        <div className="list-item-header">
                            <h3>Education {edu.id}</h3>
                            <button
                                className="delete-btn"
                                onClick={() => removeEducation(edu.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
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
                    </div>
                ))}
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
                    <button className="add-btn" onClick={addCourse}>
                        <Plus size={16} /> Add Course
                    </button>
                </div>
                {cvData.courses.map((course) => (
                    <div key={course.id} className="list-item-compact">
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
                            <button
                                className="delete-btn-inline"
                                onClick={() => removeCourse(course.id)}
                                style={{ alignSelf: 'center', marginTop: '1.25rem' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Projects */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Projects</h2>
                    <button className="add-btn" onClick={addProject}>
                        <Plus size={16} /> Add Project
                    </button>
                </div>
                {(cvData.projects || []).map((project) => (
                    <div key={project.id} className="list-item">
                        <div className="list-item-header">
                            <h3>Project {project.id}</h3>
                            <button
                                className="delete-btn"
                                onClick={() => removeProject(project.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
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
                            <label>Description</label>
                            <textarea
                                rows="3"
                                value={project.description}
                                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                placeholder="Brief description of the project..."
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* Extracurricular Activities */}
            <section className="editor-section">
                <div className="section-header">
                    <h2 className="editor-section-title">Extracurricular Activities</h2>
                    <button className="add-btn" onClick={addActivity}>
                        <Plus size={16} /> Add Activity
                    </button>
                </div>
                {(cvData.activities || []).map((activity) => (
                    <div key={activity.id} className="list-item">
                        <div className="list-item-header">
                            <h3>Activity {activity.id}</h3>
                            <button
                                className="delete-btn"
                                onClick={() => removeActivity(activity.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
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
                    </div>
                ))}
            </section>

            {/* Additional Settings */}
            <section className="editor-section toggle-section">
                <div className="toggle-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <div className="toggle-info">
                        <h3 className="editor-section-title">References</h3>
                        <p className="toggle-description">Where should "References available upon request" appear?</p>
                    </div>
                    <div className="segmented-control" style={{ display: 'flex', gap: '0.5rem', width: '100%', background: '#eee', padding: '4px', borderRadius: '50px' }}>
                        {['none', 'page1', 'page2'].map((option) => (
                            <button
                                key={option}
                                onClick={() => updatePreferences('referencesPage', option)}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    background: (cvData.preferences?.referencesPage || 'none') === option ? '#fff' : 'transparent',
                                    color: (cvData.preferences?.referencesPage || 'none') === option ? '#2563eb' : '#666',
                                    boxShadow: (cvData.preferences?.referencesPage || 'none') === option ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {option === 'none' ? 'None' : option === 'page1' ? 'Page 1' : 'Page 2'}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Editor;
