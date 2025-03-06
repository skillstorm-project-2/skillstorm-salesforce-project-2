public with sharing class ClaimsController {
    
    // Get associated claims based off of Account Id
    @AuraEnabled(cacheable=true)
    public static List<Case> getClaims(Id accountId){
        try {

            String queryString = 'SELECT Id, CaseNumber, Claim_Type__c, Claim_Status__c, CreatedDate ' + 
                                ' FROM Case' + 
                                ' WHERE AccountId =:accountId' + 
                                ' ORDER BY CreatedDate DESC';

            return Database.query(queryString);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Appeal__c> getActiveAppeals(Id accountId) {
        try {

            List<Appeal__c> appealsList = [
                SELECT Id, Name, Status__c, Claim__c 
                FROM Appeal__c 
                WHERE 
                    Claim__c IN (SELECT Id FROM Case WHERE AccountId = :accountId)
                AND
                    Status__c IN ('Awaiting Review', 'In Review')
            ];

            return appealsList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}