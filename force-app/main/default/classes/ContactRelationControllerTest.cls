@IsTest
public class ContactRelationControllerTest {

    @IsTest
    static void testFindAccounts() {
        // Step 1: Create test Accounts
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            accounts.add(new Account(
                Name = 'Test Account ' + i,
                Phone = '88888888' + i
            ));
        }
        insert accounts;

        // Step 2: Execute method
        Test.startTest();
        List<Account> result = ContactRelationController.findAccounts('Test');
        Test.stopTest();

        // Step 3: Assertions
        System.assertNotEquals(null, result, 'Account list should not be null');
        System.assert(result.size() > 0, 'At least one account should be returned');
        System.assert(result.size() <= 10, 'Result size should not exceed LIMIT 10');
    }

    @IsTest
    static void testFindContacts() {
        // Step 1: Create Account
        Account acc = new Account(Name = 'Parent Account');
        insert acc;

        // Step 2: Create Contacts under Account
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < 5; i++) {
            contacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'Contact ' + i,
                Email = 'contact' + i + '@test.com',
                Phone = '77777777' + i,
                Title = 'Developer',
                AccountId = acc.Id
            ));
        }
        insert contacts;

        // Step 3: Execute method
        Test.startTest();
        List<Contact> result = ContactRelationController.findContacts(acc.Id);
        Test.stopTest();

        // Step 4: Assertions
        System.assertNotEquals(null, result, 'Contact list should not be null');
        System.assertEquals(5, result.size(), 'All contacts should be returned');

        for (Contact c : result) {
            System.assertEquals(acc.Id, c.AccountId, 'Contact should belong to the correct Account');
        }
    }
}
