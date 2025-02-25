public with sharing class ClaimsController {
    
    // Get associated claims based off of Account Id
    @AuraEnabled(cacheable=true)
    public static List<Case> getClaims(List<String> fieldNames){
        try {
            Id userAccountId = '0014C000016ctr2QAA'; // change
            String queryString = 'SELECT ' + String.join(fieldNames, ', ') + 
                                ' FROM Case WHERE AccountId =:userAccountId ORDER BY CreatedDate DESC';
            System.debug(queryString);
            return Database.query(queryString);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}