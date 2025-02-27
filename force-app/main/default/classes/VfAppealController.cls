public with sharing class VfAppealController {
    List<Case> caseRecords = [SELECT AccountId, CreatedDate, ClosedDate, Claim_Type__c, Claim_Status__c, Decision_status__c, Subject, Description FROM Case];   
    List<Appeal__c> appealRecords = [SELECT Name, Claim__c, Appeal_Description__c, Decision_Status__c, Status__c FROM Appeal__c];
    List<Account> accountRecords = [SELECT Name, Military_Branch__c, Service_Date_End__c, Service_Date_Start__c, Discharge_Status__c, Phone FROM Account];
    
    public List<Case> getcaserecords(){
        return caseRecords;
    }

    public List<Appeal__c> getappealrecords(){
        return appealRecords;
    }

    public List<Account> getaccountrecords(){
        return accountRecords;
    }
}
