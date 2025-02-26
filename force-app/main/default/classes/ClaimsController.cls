public with sharing class ClaimsController {
    
    // Get associated claims based off of Account Id
    @AuraEnabled(cacheable=true)
    public static List<Case> getClaims(Id accountId){
        try {

            String queryString = 'SELECT Id, Claim_Type__c, Claim_Status__c, CreatedDate ' + 
                                ' FROM Case' + 
                                ' WHERE AccountId =:accountId' + 
                                ' ORDER BY CreatedDate DESC';

            return Database.query(queryString);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}