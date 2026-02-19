import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jsPDFResource from '@salesforce/resourceUrl/jsPDF';

export default class ImageToPdfConverter extends LightningElement {
    jsLoaded = false;

    async renderedCallback() {
        if (this.jsLoaded) return;
        this.jsLoaded = true;

        try {
            await loadScript(this, jsPDFResource);
        } catch (e) {
            console.error('Failed to load jsPDF', e);
        }
    }

    async handleUpload(event) {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < files.length; i++) {
            const imageData = await this.readFile(files[i]);

            pdf.addImage(
                imageData,
                'JPEG',
                10,
                10,
                pageWidth - 20,
                pageHeight - 20
            );

            if (i < files.length - 1) {
                pdf.addPage();
            }
        }

        pdf.save('images.pdf');
    }

    readFile(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }
}
