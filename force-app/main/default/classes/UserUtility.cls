
public without sharing class UserUtility {
    
    // Fetches the account ID
    @AuraEnabled(cacheable=true)
    public static Id getPersonAccountId(){
        try {
            String userId = UserInfo.getUserId();
            
            List<Account> accounts = [SELECT Id, ownerId FROM Account WHERE isPersonAccount = true AND ownerId =:userId LIMIT 1];

            return accounts[0].id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Fetches both the account ID and personal details that are relevant to forms
    @AuraEnabled(cacheable=true)
    public static Account getPersonAccountDetails(){
        try {
            String userId = UserInfo.getUserId();

            Account accountWithDetails = [
                SELECT Id, PersonBirthdate, Disability_Rating__c, Service_Date_Start__c, Service_Date_End__c 
                FROM Account 
                WHERE isPersonAccount = true and ownerId =:userId 
                LIMIT 1
                ];

            return accountWithDetails;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}