public with sharing class CloneOpportunityController {

    

    @AuraEnabled
    public static Id cloneOpportunity(Id recordId) {

        //  Validate input
        if (recordId == null) {
            System.debug('record id  null');
            throw new AuraHandledException('Record Id is missing');//  Prevents your error and provides better feedback to user
        }

        //  Fetch original Opportunity (only 5 important fields)
        List<Opportunity> oppList = [
            SELECT Id, Name, StageName, CloseDate, Amount
            FROM Opportunity
            WHERE Id = :recordId
            LIMIT 1
        ];

        //  Handle no record case (prevents your error)
        if (oppList.isEmpty()) {
            System.debug('No Opportunity found with Id: ' + recordId);
            throw new AuraHandledException('No Opportunity found');
        }

        Opportunity opp = oppList[0];

        //  Clone record
        Opportunity clonedOpp = opp.clone(false, true, false, false);

        // (Optional) Modify name so user can identify easily
        clonedOpp.Name = opp.Name + ' - Clone';

        //  Insert cloned record
        insert clonedOpp;

        //  Return new record Id
        return clonedOpp.Id;
    }
}