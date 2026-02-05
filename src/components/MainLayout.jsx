import Editor from './Editor/Editor';
import A4Page from './Preview/A4Page';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <div className="editor-container no-print">
                <Editor />
            </div>
            <div className="preview-container">
                <A4Page />
            </div>
        </div>
    );
};

export default MainLayout;
