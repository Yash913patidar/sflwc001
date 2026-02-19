import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import XLSX_LIB from '@salesforce/resourceUrl/xlsx';
import insertContacts from '@salesforce/apex/ExcelInsertController.insertContacts';

export default class ExcelUploaderParent extends LightningElement {
    @track progress = 0;
    @track statusMessage = '';
    
    allRecords = [];
    batchSize = 20;
    currentIndex = 0;
    totalSuccess = 0;
    isSaveDisabled = true;
    isXlsxLoaded = false;

    connectedCallback() {
        loadScript(this, XLSX_LIB)//loading library static resourcese
                             //console.log('xlsx load'+ XLSX_LIB);
         .then(() => { this.isXlsxLoaded = true; })//isXlsxLoaded=true
            .catch(err => console.error(' XLSX load error', err));//error if not loaded
    }

    handleFileChange(event) {//file open karne me event trigger hoga
        //console.log('event triggered');
        const file = event.target.files[0];//event.target=file input element,
        //  files=selected files, [0]=first file
        if (!file || !this.isXlsxLoaded) return;//file aur library load hue toh hi next

        const reader = new FileReader();//FileReader API se file read karenge
        reader.onload = async () => {
            const data = new Uint8Array(reader.result);//0,1 ko arraya me wrap kiya
            const workbook = XLSX.read(data, { type: 'array' });//0,1 array se javascript object me convert kiya
            const sheet = workbook.Sheets[workbook.SheetNames[0]];//first sheet select kiya xl me
            const jsonOutput = XLSX.utils.sheet_to_json(sheet);// array of objects
            console.log('jsonoutput', jsonOutput);

            // Mapping with strict check for Lastname
            this.allRecords = jsonOutput.map(row => ({// Mapping each row to Contact object
                
            
                FirstName: row['row.Firstname'] || '', 
                LastName: row['row.Lastname'] || '',
                Phone: String(row['row.Phone'] || '')
            })).filter(rec => rec.LastName !== ''); // Ensure required field exists

            console.log(' Total Records Found:', this.allRecords.length);
            
            this.currentIndex = 0;
            this.totalSuccess = 0;
            this.progress = 0;
            this.statusMessage = `Processing ${this.allRecords.length} records...`;
            
            await this.processBatches();
            console.log('All batches processed');
        };
        reader.readAsArrayBuffer(file);
    }

    async processBatches() {
        while (this.currentIndex < this.allRecords.length) {//currentIndex<total records
            const batch = this.allRecords.slice(
                this.currentIndex,
                this.currentIndex + this.batchSize//20 records at a time
                
            );
            console.log(`Processing batch: ${this.currentIndex} to ${this.currentIndex + batch.length - 1}`);

            try {
                const result = await insertContacts({ contactList: batch });
                this.totalSuccess += result.successCount;//success count ko total success me add karenge ki kitne records insert hue
                
                if (result.errors && result.errors.length > 0) {//agar errors hai toh console me print karenge
                    console.error(' Some records in batch failed:', result.errors);//errors array me failed records ke details honge, unko print karenge
                }
            } catch (error) {
                console.error(' Apex Critical Error:', error);
            }

            this.currentIndex += batch.length;//currentIndex ko batch size se increment karenge
            this.progress = Math.round((this.currentIndex / this.allRecords.length) * 100);//progress percentage calculate karenge
            this.statusMessage = `Progress: ${this.currentIndex}/${this.allRecords.length} (Inserted: ${this.totalSuccess})`;//status message update karenge

            // Wait 100ms to let UI update
            await new Promise(resolve => setTimeout(resolve, 100));//ui update hone ke liye thoda wait 
        }

        this.statusMessage = `Completed! ${this.totalSuccess} records inserted successfully.`;//final status message update karenge
        this.isSaveDisabled = false;//save button enable karenge jab processing complete ho jaye
    }
}