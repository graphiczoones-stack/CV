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
  preferences: {
    referencesPage: 'none',
  },
};

export const CvProvider = ({ children }) => {
  const [cvData, setCvData] = useState(() => {
    const savedData = localStorage.getItem('cvData');
    return savedData ? JSON.parse(savedData) : INITIAL_DATA;
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
        addLink,
        updateLink,
        removeLink,
        updatePreferences,
      }}
    >
      {children}
    </CvContext.Provider>
  );
};
