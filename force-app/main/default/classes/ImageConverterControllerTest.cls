@IsTest
public class ImageConverterControllerTest {

    /* -----------------------------
       Helper: Sample Base64 strings
       ----------------------------- */
    private static String getSampleImageBase64() {
        Blob b = Blob.valueOf('Test Image Content');
        return 'data:image/jpeg;base64,' + EncodingUtil.base64Encode(b);
    }

    private static String getSamplePdfBase64() {
        Blob b = Blob.valueOf('Test PDF Content');
        return 'data:application/pdf;base64,' + EncodingUtil.base64Encode(b);
    }

    /* -----------------------------
       Test: saveImages()
       ----------------------------- */
    @IsTest
    static void testSaveImages() {
        List<String> images = new List<String>{
            getSampleImageBase64()
        };

        List<String> fileNames = new List<String>{
            'TestImage'
        };

        Test.startTest();
        ImageConverterController.saveImages(images, fileNames);
        Test.stopTest();

        List<ContentVersion> results = [
            SELECT Id, Title, FileType
            FROM ContentVersion
            WHERE Title = 'TestImage'
        ];

        System.assertEquals(1, results.size(), 'Image should be saved');
        System.assertEquals('JPEG', results[0].FileType);
    }

    /* -----------------------------
       Test: getSavedImages()
       ----------------------------- */
    @IsTest
    static void testGetSavedImages() {
        // Create image first
        testSaveImages();

        Test.startTest();
        List<ContentVersion> images =
            ImageConverterController.getSavedImages();
        Test.stopTest();

        System.assert(images.size() > 0, 'Should return saved JPEG images');
    }

    /* -----------------------------
       Test: deleteFiles()
       ----------------------------- */
    @IsTest
    static void testDeleteFiles() {
        // Insert an image
        testSaveImages();

        ContentVersion cv = [
            SELECT Id, ContentDocumentId
            FROM ContentVersion
            LIMIT 1
        ];

        Test.startTest();
        ImageConverterController.deleteFiles(
            new List<Id>{ cv.Id }
        );
        Test.stopTest();

        Integer countDocs = [
            SELECT COUNT()
            FROM ContentDocument
            WHERE Id = :cv.ContentDocumentId
        ];

        System.assertEquals(0, countDocs, 'File should be deleted');
    }

    /* -----------------------------
       Test: savePdf()
       ----------------------------- */
    @IsTest
    static void testSavePdf() {
        String pdfBase64 = getSamplePdfBase64();

        Test.startTest();
        ImageConverterController.savePdf(pdfBase64, 'TestPDF');
        Test.stopTest();

        ContentVersion pdf = [
            SELECT Id, Title, FileType
            FROM ContentVersion
            WHERE Title = 'TestPDF'
            LIMIT 1
        ];

        System.assertEquals('PDF', pdf.FileType);
    }
}
