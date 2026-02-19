public with sharing class ImageConverterController {

    // SAVE JPEG IMAGES
    @AuraEnabled
    public static void saveImages(List<String> base64Images, List<String> fileNames) {
        List<ContentVersion> versions = new List<ContentVersion>();

        for (Integer i = 0; i < base64Images.size(); i++) {
            String data = base64Images[i];
            if (data.contains(',')) {
                data = data.substringAfter(',');
            }

            versions.add(new ContentVersion(
                Title = fileNames[i],
                PathOnClient = fileNames[i] + '.jpeg',
                VersionData = EncodingUtil.base64Decode(data),
                IsMajorVersion = true
            ));
        }

        insert versions;
    }

    // FETCH STORED JPEG FILES
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getSavedImages() {
        return [
            SELECT Id, Title, ContentDocumentId
            FROM ContentVersion
            WHERE FileType = 'JPEG'
            ORDER BY CreatedDate DESC
            LIMIT 50
        ];
    }

    // DELETE SELECTED FILES
    @AuraEnabled
    public static void deleteFiles(List<Id> contentVersionIds) {
        Set<Id> docIds = new Set<Id>();

        for (ContentVersion cv : [
            SELECT ContentDocumentId
            FROM ContentVersion
            WHERE Id IN :contentVersionIds
        ]) {
            docIds.add(cv.ContentDocumentId);
        }

        delete [SELECT Id FROM ContentDocument WHERE Id IN :docIds];
    }

    // SAVE GENERATED PDF TO FILES
    @AuraEnabled
    public static void savePdf(String base64Pdf, String fileName) {
        if (base64Pdf.contains(',')) {
            base64Pdf = base64Pdf.substringAfter(',');
        }

        ContentVersion pdf = new ContentVersion(
            Title = fileName,
            PathOnClient = fileName + '.pdf',
            VersionData = EncodingUtil.base64Decode(base64Pdf),
            IsMajorVersion = true
        );

        insert pdf;
    }
}
