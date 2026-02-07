import { createContext, useContext, useState, useEffect } from 'react';

const CvContext = createContext();

export const useCv = () => {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error('useCv must be used within CvProvider');
  }
  return context;
};

const INITIAL_DATA = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    links: [],
  },
  education: [],
  experience: [],
  skills: {
    technical: [],
    soft: [],
  },
  courses: [],
  projects: [],
  activities: [],
  languages: [],
  sections: {
    page1: ['summary', 'education', 'experience', 'projects'],
    page2: ['activities', 'courses', 'skills', 'languages'],
  },
  preferences: {},
};

export const CvProvider = ({ children }) => {
  const [cvData, setCvData] = useState(() => {
    try {
      const savedData = localStorage.getItem('cvData');
      if (!savedData) return INITIAL_DATA;

      const parsed = JSON.parse(savedData);

      // SANITATION: Ensure all sections exist exactly once
      const allKnownSections = [
        'summary', 'education', 'experience', 'projects',
        'activities', 'courses', 'skills', 'languages'
      ];

      let p1 = Array.isArray(parsed.sections?.page1) ? parsed.sections.page1 : INITIAL_DATA.sections.page1;
      let p2 = Array.isArray(parsed.sections?.page2) ? parsed.sections.page2 : INITIAL_DATA.sections.page2;

      const seen = new Set();
      const finalP1 = [];
      const finalP2 = [];

      p1.forEach(s => {
        if (allKnownSections.includes(s) && !seen.has(s)) {
          finalP1.push(s);
          seen.add(s);
        }
      });

      p2.forEach(s => {
        if (allKnownSections.includes(s) && !seen.has(s)) {
          finalP2.push(s);
          seen.add(s);
        }
      });

      // Add missing sections to page 2 (including new ones like languages)
      allKnownSections.forEach(s => {
        if (!seen.has(s)) {
          finalP2.push(s);
          seen.add(s);
        }
      });

      return {
        ...INITIAL_DATA,
        ...parsed,
        personal: { ...INITIAL_DATA.personal, ...(parsed.personal || {}) },
        sections: { page1: finalP1, page2: finalP2 },
        preferences: { ...INITIAL_DATA.preferences, ...(parsed.preferences || {}) }
      };
    } catch (e) {
      console.error('Error loading saved CV data:', e);
      return INITIAL_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  const updatePersonal = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateEducation = (id, updates) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const addEducation = () => {
    const newId = Math.max(...cvData.education.map(e => e.id), 0) + 1;
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: newId,
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }));
  };

  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id),
    }));
  };

  const updateExperience = (id, updates) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const addExperience = () => {
    const newId = Math.max(...cvData.experience.map(e => e.id), 0) + 1;
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: newId,
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          responsibilities: [''],
        },
      ],
    }));
  };

  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id),
    }));
  };

  const updateSkills = (category, skills) => {
    setCvData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: skills },
    }));
  };

  const addCourse = () => {
    const newId = Math.max(...cvData.courses.map(c => c.id), 0) + 1;
    setCvData(prev => ({
      ...prev,
      courses: [
        ...prev.courses,
        { id: newId, name: '', provider: '', year: '', hours: '', link: '' },
      ],
    }));
  };

  const updateCourse = (id, updates) => {
    setCvData(prev => ({
      ...prev,
      courses: prev.courses.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeCourse = (id) => {
    setCvData(prev => ({
      ...prev,
      courses: prev.courses.filter(item => item.id !== id),
    }));
  };

  const addProject = () => {
    const newId = Math.max(...(cvData.projects || []).map(p => p.id), 0) + 1;
    setCvData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { id: newId, name: '', description: '', link: '' },
      ],
    }));
  };

  const updateProject = (id, updates) => {
    setCvData(prev => ({
      ...prev,
      projects: (prev.projects || []).map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeProject = (id) => {
    setCvData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(item => item.id !== id),
    }));
  };

  const addActivity = () => {
    const newId = Math.max(...(cvData.activities || []).map(a => a.id), 0) + 1;
    setCvData(prev => ({
      ...prev,
      activities: [
        ...(prev.activities || []),
        { id: newId, name: '', role: '', description: '' },
      ],
    }));
  };

  const updateActivity = (id, updates) => {
    setCvData(prev => ({
      ...prev,
      activities: (prev.activities || []).map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeActivity = (id) => {
    setCvData(prev => ({
      ...prev,
      activities: (prev.activities || []).filter(item => item.id !== id),
    }));
  };

  const addLanguage = (id = Date.now()) => {
    setCvData(prev => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        { id, name: '', level: 'Fluent' },
      ],
    }));
  };

  const updateLanguage = (id, updates) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeLanguage = (id) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(item => item.id !== id),
    }));
  };

  const addLink = () => {
    const newId = Math.max(...(cvData.personal.links || []).map(l => l.id), 0) + 1;
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: [
          ...(prev.personal.links || []),
          { id: newId, label: '', url: '' },
        ],
      },
    }));
  };

  const updateLink = (id, updates) => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: (prev.personal.links || []).map(link =>
          link.id === id ? { ...link, ...updates } : link
        ),
      },
    }));
  };

  const removeLink = (id) => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: (prev.personal.links || []).filter(link => link.id !== id),
      },
    }));
  };

  const moveSection = (sectionId, direction) => {
    setCvData(prev => {
      const page1 = [...(prev.sections?.page1 || [])];
      const page2 = [...(prev.sections?.page2 || [])];

      const inPage1 = page1.includes(sectionId);
      const inPage2 = page2.includes(sectionId);

      if (inPage1) {
        const index = page1.indexOf(sectionId);
        if (direction === 'up') {
          if (index > 0) {
            [page1[index], page1[index - 1]] = [page1[index - 1], page1[index]];
          }
        } else {
          if (index < page1.length - 1) {
            [page1[index], page1[index + 1]] = [page1[index + 1], page1[index]];
          } else {
            // Move to Page 2 (Top)
            const filtered1 = page1.filter(id => id !== sectionId);
            return {
              ...prev,
              sections: {
                page1: filtered1,
                page2: [sectionId, ...page2]
              }
            };
          }
        }
      } else if (inPage2) {
        const index = page2.indexOf(sectionId);
        if (direction === 'up') {
          if (index > 0) {
            [page2[index], page2[index - 1]] = [page2[index - 1], page2[index]];
          } else {
            // Move to Page 1 (Bottom)
            const filtered2 = page2.filter(id => id !== sectionId);
            return {
              ...prev,
              sections: {
                page1: [...page1, sectionId],
                page2: filtered2
              }
            };
          }
        } else {
          if (index < page2.length - 1) {
            [page2[index], page2[index + 1]] = [page2[index + 1], page2[index]];
          }
        }
      }

      return {
        ...prev,
        sections: { page1, page2 }
      };
    });
  };

  const updatePreferences = (field, value) => {
    setCvData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  return (
    <CvContext.Provider
      value={{
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
        addProject,
        updateProject,
        removeProject,
        addActivity,
        updateActivity,
        removeActivity,
        addLanguage,
        updateLanguage,
        removeLanguage,
        addLink,
        updateLink,
        removeLink,
        moveSection,
        updatePreferences,
      }}
    >
      {children}
    </CvContext.Provider>
  );
};
