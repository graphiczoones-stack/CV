import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, Files, File } from 'lucide-react';
import { useCv } from '../../context/CvContext';
import translations from '../../utils/translations';
import './DownloadDropdown.css';

const DownloadDropdown = ({ onExport }) => {
    const { cvData } = useCv();
    const lang = cvData.preferences?.language || 'en';
    const t = translations[lang];

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onExport(option);
        setIsOpen(false);
    };

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <button
                className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Download size={18} />
                <span>{t.downloadPdf}</span>
                <ChevronDown size={16} className={`chevron ${isOpen ? 'rotate' : ''}`} />
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => handleSelect('all')}>
                        <Files size={16} />
                        <span>{t.allPages}</span>
                    </div>
                    <div className="dropdown-item" onClick={() => handleSelect('page1')}>
                        <FileText size={16} />
                        <span>{t.page1Only}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DownloadDropdown;
