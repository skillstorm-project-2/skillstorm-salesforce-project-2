/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class AppealRecordAssignmentTest {

    @isTest
    static void testOwnerIdChangedSuccessfully() {
        AppealQueueProcessor processor = new AppealQueueProcessor();
        ClaimTestTriggerControl.isTest = true;

        Account testAccount = new Account(
            Name = 'Test Account',
            Military_Branch__c = 'Army',
            Discharge_Status__c = 'Honorable Discharge', 
            Service_Date_End__c = Date.today(), 
            Service_Date_Start__c = Date.today()
        );
        insert testAccount;
        
        Case testCase = new Case(
            Subject = 'Test Case',
            Description = 'Test Description',
            Status = 'New',
            Origin = 'Web',
            Claim_Type__c = 'Pension',
            AccountId = testAccount.Id
        );
        insert testCase;

        Appeal__c testAppeal = new Appeal__c(
            Claim__c = testCase.Id,
            Appeal_Description__c = 'Test Appeal'
        );
        List<Appeal__c> testAppeals = new List<Appeal__c>{testAppeal};

        Test.startTest();
        processor.process(testAppeals, null);
        Test.stopTest();

        System.assertNotEquals(null, testAppeal.OwnerId);
    }

    @isTest
    static void testAppealNoMilitaryBranch() {
        AppealQueueProcessor processor = new AppealQueueProcessor();
        ClaimTestTriggerControl.isTest = true;

        Account testAccount = new Account(
            Name = 'Test Account',
            Discharge_Status__c = 'Honorable Discharge', 
            Service_Date_End__c = Date.today(), 
            Service_Date_Start__c = Date.today()
        );
        insert testAccount;
        
        Case testCase = new Case(
            Subject = 'Test Case',
            Description = 'Test Description',
            Status = 'New',
            Origin = 'Web',
            Claim_Type__c = 'Pension',
            AccountId = testAccount.Id
        );
        insert testCase;

        Appeal__c testAppeal = new Appeal__c(
            Claim__c = testCase.Id,
            Appeal_Description__c = 'Test Appeal'
        );

        List<Appeal__c> testAppeals = new List<Appeal__c>{testAppeal};

        Test.startTest();
        try {
            processor.process(testAppeals, null);
            System.assert(false, 'Expected an exception to be thrown');
        } catch (NullPointerException e) {
            System.assert(true, 'Expected exception was thrown');
        }
        Test.stopTest();
    }

    @isTest
    static void testWrongObjectPassedIn() {
        AppealQueueProcessor processor = new AppealQueueProcessor();

        // Create a list of wrong objects (e.g., Account instead of Claim)
        List<Account> wrongObjects = new List<Account>();
        wrongObjects.add(new Account(Name = 'Test Account'));

        // Call the method with wrong objects and verify that it handles the error
        try {
            processor.process(wrongObjects, null);
            System.assert(false, 'Expected an exception to be thrown');
        } catch (IllegalArgumentException e) {
            System.assertEquals('Object in list is not of type Appeal__c', e.getMessage());
        }
    }
}