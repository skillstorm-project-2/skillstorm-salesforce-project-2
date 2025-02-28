public with sharing class VfAppealController {
    public List<Account> accList { get; set; } 
    public List<Case> caseList { get; set; }
    public List<Appeal__c> appealList { get; set; }

    public VfAppealController() {
        accList = [SELECT Id, Name, Military_Branch__c, Phone, Disability_Rating__c, Discharge_Status__c FROM Account];
        caseList = [SELECT Id, AccountId, CreatedDate, ClosedDate, Claim_Type__c, Claim_Status__c, Decision_status__c, Subject, Description FROM Case];

        // Fetching Appeals and processing Appeal_Description__c
        appealList = [SELECT Id, Name, Claim__c, Appeal_Description__c, Decision_Status__c, Status__c FROM Appeal__c];

        // Remove <p> tags from Appeal_Description__c while retaining Ids
        for (Appeal__c app : appealList) {
            if (app.Appeal_Description__c != null) {
                app.Appeal_Description__c = app.Appeal_Description__c.replaceAll('<p>', '').replaceAll('</p>', '');
            } 
        }
    }
}