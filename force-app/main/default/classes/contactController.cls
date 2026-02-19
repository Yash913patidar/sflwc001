public with sharing class contactController {
    @AuraEnabled(cacheable=true)
    
   public static List<Contact> getContactList() {
    
       List<Contact> conList = [SELECT Id, Name, FirstName, Lastname, Phone, Email, Title, PhotoUrl FROM Contact
       WHERE PhotoUrl != null
       With USER_MODE
       LIMIT 10
        ];
        return conList;
   }
}