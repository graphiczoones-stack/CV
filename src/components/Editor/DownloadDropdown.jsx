import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, Files, File } from 'lucide-react';
import './DownloadDropdown.css';

const DownloadDropdown = ({ onExport }) => {
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
                <span>Download PDF</span>
                <ChevronDown size={16} className={`chevron ${isOpen ? 'rotate' : ''}`} />
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => handleSelect('all')}>
                        <Files size={16} />
                        <span>All Pages</span>
                    </div>
                    <div className="dropdown-item" onClick={() => handleSelect('page1')}>
                        <FileText size={16} />
                        <span>Page 1 Only</span>
                    </div>
                    <div className="dropdown-item" onClick={() => handleSelect('page2')}>
                        <File size={16} />
                        <span>Page 2 Only</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DownloadDropdown;
