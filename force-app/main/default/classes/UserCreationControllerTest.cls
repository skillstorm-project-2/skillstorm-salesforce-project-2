@isTest
private class UserCreationControllerTest {
  @testSetup
  static void setupTestData() {
    // Create the test profile
    Profile claimsUserProfile = [
      SELECT Id
      FROM Profile
      WHERE Name = 'Vet'
      LIMIT 1
    ];
  }

  @isTest
  static void testCreateUser() {
    // Create test data for user
    Map<String, Object> userMap = new Map<String, Object>();
    userMap.put('FirstName', 'Test');
    userMap.put('LastName', 'Veteran');
    userMap.put('Email', 'testuser' + generateRandomString() + '@example.com');
    userMap.put(
      'Username',
      'testuser' + generateRandomString() + '@example.com'
    );
    userMap.put('Alias', 'tvet');
    userMap.put('CommunityNickname', 'TestVet' + generateRandomString());
    userMap.put('TimeZoneSidKey', 'America/New_York');
    userMap.put('LocaleSidKey', 'en_US');
    userMap.put('EmailEncodingKey', 'UTF-8');
    userMap.put('LanguageLocaleKey', 'en_US');
    userMap.put('IsActive', true);

    String userJson = JSON.serialize(userMap);

    User adminUser = createAdminUser();

    String userId;
    Test.startTest();
    System.runAs(adminUser) {
      userId = UserCreationController.createUser(userJson);
    }
    Test.stopTest();

    User createdUser = [
      SELECT Id, FirstName, LastName, Email, ProfileId
      FROM User
      WHERE Id = :userId
      LIMIT 1
    ];

    System.assertEquals('Test', createdUser.FirstName);
    System.assertEquals('Veteran', createdUser.LastName);
    System.assertEquals(userMap.get('Email'), createdUser.Email);

    // Verify the profile was assigned correctly
    Profile claimsUserProfile = [
      SELECT Id
      FROM Profile
      WHERE Name = 'Vet'
      LIMIT 1
    ];
    System.assertEquals(claimsUserProfile.Id, createdUser.ProfileId);
  }

  @isTest
  static void testCreatePersonAccount() {
    // Create a user first
    User testUser = createTestUser();

    // Create test data for person account
    Map<String, Object> accountMap = new Map<String, Object>();
    accountMap.put('Military_Branch__c', 'Army');
    accountMap.put('Discharge_Status__c', 'Honorable Discharge');
    accountMap.put('Phone', '555-123-4567');
    accountMap.put('parsedStartDate', '01/01/2010');
    accountMap.put('parsedEndDate', '01/01/2015');

    String accountJson = JSON.serialize(accountMap);

    Test.startTest();
    // Execute as admin user to avoid mixed DML issues
    User adminUser = createAdminUser();

    String accountId;
    System.runAs(adminUser) {
      accountId = UserCreationController.createPersonAccount(
        accountJson,
        testUser.Id
      );
    }
    Test.stopTest();

    // Verify the person account was created
    Account personAccount = [
      SELECT
        Id,
        Military_Branch__c,
        Discharge_Status__c,
        Phone,
        Service_Date_Start__c,
        Service_Date_End__c,
        FirstName,
        LastName,
        PersonEmail,
        OwnerId
      FROM Account
      WHERE Id = :accountId
      LIMIT 1
    ];

    System.assertEquals('Army', personAccount.Military_Branch__c);
    System.assertEquals(
      'Honorable Discharge',
      personAccount.Discharge_Status__c
    );
    System.assertEquals('555-123-4567', personAccount.Phone);
    System.assertEquals(
      Date.parse('01/01/2010'),
      personAccount.Service_Date_Start__c
    );
    System.assertEquals(
      Date.parse('01/01/2015'),
      personAccount.Service_Date_End__c
    );
    System.assertEquals(testUser.FirstName, personAccount.FirstName);
    System.assertEquals(testUser.LastName, personAccount.LastName);
    System.assertEquals(testUser.Email, personAccount.PersonEmail);
    System.assertEquals(testUser.Id, personAccount.OwnerId);
  }

  @isTest
  static void testCreateUserWithInvalidData() {
    // Test with invalid data to verify error handling
    Map<String, Object> userMap = new Map<String, Object>();
    // Missing required fields
    userMap.put('FirstName', 'Test');
    // Missing LastName

    String userJson = JSON.serialize(userMap);

    User adminUser = createAdminUser();

    Test.startTest();
    try {
      System.runAs(adminUser) {
        UserCreationController.createUser(userJson);
        System.assert(false, 'Expected an exception but none was thrown');
      }
    } catch (AuraHandledException e) {
      // Expected exception
      System.assert(true, 'Exception was caught as expected');
    }
    Test.stopTest();
  }

  @isTest
  static void testCreatePersonAccountWithInvalidData() {
    // Create a user first
    User testUser = createTestUser();

    // Test with invalid date format
    Map<String, Object> accountMap = new Map<String, Object>();
    accountMap.put('Military_Branch__c', 'Army');
    accountMap.put('Discharge_Status__c', 'Honorable Discharge');
    accountMap.put('parsedStartDate', 'not-a-date'); // Invalid date format
    accountMap.put('parsedEndDate', '01/01/2015');

    String accountJson = JSON.serialize(accountMap);

    User adminUser = createAdminUser();

    Test.startTest();
    try {
      System.runAs(adminUser) {
        UserCreationController.createPersonAccount(accountJson, testUser.Id);
        System.assert(false, 'Expected an exception but none was thrown');
      }
    } catch (AuraHandledException e) {
      // Expected exception
      System.assert(true, 'Exception was caught as expected');
    }
    Test.stopTest();
  }

  // Helper methods
  private static String generateRandomString() {
    return String.valueOf(Datetime.now().getTime());
  }

  private static User createAdminUser() {
    // Create an admin user to avoid mixed DML operations
    Profile adminProfile = [
      SELECT Id
      FROM Profile
      WHERE Name = 'System Administrator'
      LIMIT 1
    ];

    User adminUser = new User(
      FirstName = 'Admin',
      LastName = 'User',
      Email = 'admin' + generateRandomString() + '@example.com',
      Username = 'admin' + generateRandomString() + '@example.com',
      Alias = 'admin',
      CommunityNickname = 'admin' + generateRandomString(),
      TimeZoneSidKey = 'America/New_York',
      LocaleSidKey = 'en_US',
      EmailEncodingKey = 'UTF-8',
      LanguageLocaleKey = 'en_US',
      ProfileId = adminProfile.Id,
      IsActive = true
    );

    insert adminUser;
    return adminUser;
  }

  private static User createTestUser() {
    Profile claimsUserProfile = [
      SELECT Id
      FROM Profile
      WHERE Name = 'Vet'
      LIMIT 1
    ];

    User testUser = new User(
      FirstName = 'Test',
      LastName = 'User',
      Email = 'testuser' + generateRandomString() + '@example.com',
      Username = 'testuser' + generateRandomString() + '@example.com',
      Alias = 'tuser',
      CommunityNickname = 'TestUser' + generateRandomString(),
      TimeZoneSidKey = 'America/New_York',
      LocaleSidKey = 'en_US',
      EmailEncodingKey = 'UTF-8',
      LanguageLocaleKey = 'en_US',
      ProfileId = claimsUserProfile.Id,
      IsActive = true
    );

    // Insert the user with System.runAs to avoid mixed DML exceptions
    User adminUser = createAdminUser();
    System.runAs(adminUser) {
      insert testUser;
    }

    return testUser;
  }
}