import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (mode = 'all', fileName = 'CV.pdf') => {
    try {
        // Show loading cursor
        const originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'wait';

        // Find all page elements
        const page1 = document.getElementById('cv-content');
        const page2 = document.getElementById('cv-page-2');

        let originalPages = [];

        if (mode === 'all') {
            if (page1) originalPages.push(page1);
            if (page2) originalPages.push(page2);
        } else if (mode === 'page1' && page1) {
            originalPages.push(page1);
        } else if (mode === 'page2' && page2) {
            originalPages.push(page2);
        }

        if (originalPages.length === 0) {
            console.error('No pages found to export');
            document.body.style.cursor = originalCursor;
            return;
        }

        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = 210;
        const pdfHeight = 297;

        // Create a temporary container to hold clean clones
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.left = '0';
        container.style.width = '210mm'; // Enforce A4 width
        container.style.height = 'auto';
        container.style.zIndex = '-9999';
        container.style.backgroundColor = '#ffffff';
        document.body.appendChild(container);

        try {
            for (let i = 0; i < originalPages.length; i++) {
                const originalPage = originalPages[i];

                // Clone the page
                const clone = originalPage.cloneNode(true);

                // Reset any responsive scaling or margins on the clone
                clone.style.transform = 'none';
                clone.style.margin = '0';
                clone.style.boxShadow = 'none';
                clone.style.width = '210mm';
                clone.style.height = '297mm';
                clone.style.padding = '5mm'; // Ensure consisten padding
                clone.style.boxSizing = 'border-box';

                // Force remove any mobile-specific classes or styles if necessary
                // For now, ensuring width is 210mm is key.

                container.appendChild(clone);

                // Get links from the ORIGINAL page to preserve positions if layout matches, 
                // OR better, get links from CLONE since it will definitely be 210mm.
                // Let's rely on clone for accurate layout representation.
                // Wait for layout to settle
                await new Promise(resolve => setTimeout(resolve, 250));

                const links = Array.from(clone.querySelectorAll('a')).map(link => {
                    const rect = link.getBoundingClientRect();
                    return {
                        url: link.href,
                        el: link
                    };
                });

                const canvas = await html2canvas(clone, {
                    scale: 3, // High quality
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    width: 794, // A4 width at 96 DPI
                    height: 1123, // A4 height
                    windowWidth: 1200,
                });

                if (i > 0) {
                    pdf.addPage();
                }

                const imgData = canvas.toDataURL('image/png', 1.0);
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

                // Add links
                // We need to re-calculate rects relative to the clone page
                const pageRect = clone.getBoundingClientRect();
                const scaleFactor = pdfWidth / pageRect.width;

                links.forEach(({ url, el }) => {
                    const rect = el.getBoundingClientRect();
                    pdf.link(
                        (rect.left - pageRect.left) * scaleFactor,
                        (rect.top - pageRect.top) * scaleFactor,
                        rect.width * scaleFactor,
                        rect.height * scaleFactor,
                        { url }
                    );
                });

                // Clean up clone from container to save memory/DOM space for next iteration
                container.removeChild(clone);
            }
        } finally {
            // Always remove container
            document.body.removeChild(container);
            document.body.style.cursor = originalCursor;
        }

        // Download
        pdf.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
        document.body.style.cursor = 'default';
        alert('Failed to generate PDF. Please try again.');
    }
};
