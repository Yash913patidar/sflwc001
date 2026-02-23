@isTest
public class ExcelInsertControllerTest {

    @isTest
    static void testInsertContacts() {

        List<Contact> contacts = new List<Contact>{
            new Contact(FirstName='John', LastName='Doe', Phone='1234567890')
        };

        Test.startTest();
        Map<String, Object> result =
            ExcelInsertController.insertContacts(contacts);
        Test.stopTest();

        System.assertEquals(1, (Integer) result.get('successCount'));
    }
}
