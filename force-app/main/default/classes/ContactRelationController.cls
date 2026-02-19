public with sharing class ContactRelationController {

    @AuraEnabled(cacheable=true)
    public static List<Account> findAccounts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Phone
            FROM Account
            WHERE Name LIKE :key
            LIMIT 10
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String accountId) {
        return [
            SELECT Id, LastName, Title, Phone, Email
            FROM Contact
            WHERE AccountId = :accountId
            LIMIT 10
        ];
    }
}