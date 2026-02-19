import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jsPDFResource from '@salesforce/resourceUrl/jsPDF';

import saveImages from '@salesforce/apex/ImageConverterController.saveImages';
import getSavedImages from '@salesforce/apex/ImageConverterController.getSavedImages';
import deleteFiles from '@salesforce/apex/ImageConverterController.deleteFiles';
import savePdf from '@salesforce/apex/ImageConverterController.savePdf';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ImageToPdf extends LightningElement {
    @track files = [];
    selectedIds = new Set();
    jsLoaded = false;

    get disableActions() {
        return this.selectedIds.size === 0;
    }

    renderedCallback() {
        if (this.jsLoaded) return;
        loadScript(this, jsPDFResource)
            .then(() => (this.jsLoaded = true))
            .catch(() => this.toast('Error', 'jsPDF failed to load', 'error'));
    }

    connectedCallback() {
        this.loadFiles();
    }

    loadFiles() {
        getSavedImages()
            .then(data => {
                this.files = data;
                this.selectedIds.clear();
            })
            .catch(e => this.toast('Error', e.body.message, 'error'));
    }

    handleUpload(event) {
        const files = Array.from(event.target.files);
        const images = [];
        const names = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                images.push(reader.result);
                names.push(file.name);

                if (images.length === files.length) {
                    saveImages({ base64Images: images, fileNames: names })
                        .then(() => {
                            this.toast('Success', 'Images uploaded', 'success');
                            this.loadFiles();
                        })
                        .catch(e => this.toast('Error', e.body.message, 'error'));
                }
            };
            reader.readAsDataURL(file);
        });
    }

    toggleSelection(event) {
        const id = event.target.dataset.id;
        event.target.checked
            ? this.selectedIds.add(id)
            : this.selectedIds.delete(id);
    }

    async generatePdf() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        let index = 0;
        for (const versionId of this.selectedIds) {
            const url = `/sfc/servlet.shepherd/version/download/${versionId}`;

            const base64 = await fetch(url)
                .then(r => {
                    if (!r.ok) throw new Error('Image fetch failed');
                    return r.blob();
                })
                .then(this.blobToBase64);

            if (index++ > 0) pdf.addPage();
            pdf.addImage(base64, 'JPEG', 10, 10, 190, 270);
        }

        return pdf;
    }

    async downloadPdf() {
        try {
            const pdf = await this.generatePdf();
            pdf.save('Images.pdf');
            this.toast('Success', 'PDF downloaded', 'success');
        } catch (e) {
            this.toast('Error', e.message, 'error');
        }
    }

    async savePdfToFiles() {
        try {
            const pdf = await this.generatePdf();
            const base64Pdf = pdf.output('datauristring');

            await savePdf({
                base64Pdf,
                fileName: 'GeneratedImages'
            });

            this.toast('Success', 'PDF saved to Files', 'success');
        } catch (e) {
            this.toast('Error', e.message, 'error');
        }
    }

    deleteSelected() {
        deleteFiles({ contentVersionIds: [...this.selectedIds] })
            .then(() => {
                this.toast('Deleted', 'Images deleted', 'success');
                this.loadFiles();
            })
            .catch(e => this.toast('Error', e.body.message, 'error'));
    }

    blobToBase64(blob) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    toast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}
