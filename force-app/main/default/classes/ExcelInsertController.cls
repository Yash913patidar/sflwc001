public with sharing class ExcelInsertController {
    @AuraEnabled
    public static Map<String, Object> insertContacts(List<Contact> contactList) {
                     System.debug('contactList: ' + contactList);//output=contactList: (Contact:{FirstName=John, LastName=Doe, Phone=1234567890})
        Map<String, Object> response = new Map<String, Object>();
                     System.debug('contactList size: ' + contactList.size());//output=contactList size: 1
        List<String> errorMessages = new List<String>();
                     System.debug('contactList size after debug: ' + contactList.size());    
        Integer successCount = 0;

        // Create Database.DMLOptions to bypass duplicate rules
        Database.DMLOptions dml = new Database.DMLOptions();
          System.debug('DMLOptions created');
        dml.DuplicateRuleHeader.AllowSave = true; // This bypasses the "Use one of these records?" block
        
        dml.OptAllOrNone = false;


        // Use the database method with DMLOptions
        Database.SaveResult[] results = Database.insert(contactList, dml);
        System.debug('Database.insert executed with DMLOptions');
        for (Integer i = 0; i < results.size(); i++) {
            System.debug('Processing result for record ' + (i + 1) + ': ' + results[i]);
            if (results[i].isSuccess()) {
                successCount++;
                System.debug('Record ' + (i + 1) + ' inserted successfully.');
            } else {
                for (Database.Error err : results[i].getErrors()) {
                    errorMessages.add('Record ' + (i + 1) + ': ' + err.getMessage());
                }
            }
        }

        response.put('successCount', successCount);
        System.debug('Total successful inserts: ' + successCount);
        response.put('errors', errorMessages);
        System.debug('Error messages: ' + errorMessages);
        return response;
        
    }
}