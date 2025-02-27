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
private class ClaimRecordAssignmentTest {

    @isTest
    static void testGetBranchQueues() {
        // Create a new instance of the ClaimQueueProcessor
        ClaimQueueProcessor processor = new ClaimQueueProcessor();

        // Get the branch queues
        Map<String, Group> branchQueues = processor.getBranchQueues();

        // Verify that the branch queues are not null
        System.assertEquals(6, branchQueues.size());
    }

    @isTest
    static void testOwnerIdChangedSuccessfully() {
        // Create a new instance of the ClaimQueueProcessor
        ClaimQueueProcessor processor = new ClaimQueueProcessor();

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

        List<Case> testCases = new List<Case>{testCase};

        Test.startTest();
        processor.process(testCases, null);
        Test.stopTest();

        System.assertNotEquals(null, testCase.OwnerId);
    }

    @isTest
    static void testCaseNoMilitaryBranch() {
        // Create a new instance of the ClaimQueueProcessor
        ClaimQueueProcessor processor = new ClaimQueueProcessor();

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
            Account = testAccount
        );

        List<Case> testCases = new List<Case>{testCase};

        Test.startTest();
        try {
            processor.process(testCases, null);
            System.assert(false, 'Expected an exception to be thrown');
        } catch (NullPointerException e) {
            System.assert(true, 'Expected exception was thrown');
        }
        Test.stopTest();
    }

    @isTest
    static void testWrongObjectPassedIn() {
        // Create a new instance of the ClaimQueueProcessor
        ClaimQueueProcessor processor = new ClaimQueueProcessor();

        // Create a list of wrong objects (e.g., Account instead of Claim)
        List<Account> wrongObjects = new List<Account>();
        wrongObjects.add(new Account(Name = 'Test Account'));

        // Call the method with wrong objects and verify that it handles the error
        try {
            processor.process(wrongObjects, null);
            System.assert(false, 'Expected an exception to be thrown');
        } catch (IllegalArgumentException e) {
            System.assertEquals('Object in list is not of type Case', e.getMessage());
        }
    }
}