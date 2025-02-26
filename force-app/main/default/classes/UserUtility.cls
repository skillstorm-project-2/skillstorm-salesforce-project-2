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
}