public with sharing class UserCreationController {
  @AuraEnabled
  public static String createUser(String userJson) {
    try {
      // Deserialize the JSON string into a Map
      Map<String, Object> userMap = (Map<String, Object>) JSON.deserializeUntyped(
        userJson
      );

      // Create the User record
      User newUser = new User();
      // Will need to change to veteran user in production. Do not have access to profile in this sandbox
      Id veteranUserId = [
        SELECT Id
        FROM Profile
        WHERE Name = 'Claims User'
        LIMIT 1
      ]
      .Id;

      // Set the required fields from the form
      newUser.FirstName = (String) userMap.get('FirstName');
      newUser.LastName = (String) userMap.get('LastName');
      newUser.Email = (String) userMap.get('Email');
      newUser.Username = (String) userMap.get('Username');
      newUser.Alias = (String) userMap.get('Alias');
      newUser.CommunityNickname = (String) userMap.get('CommunityNickname');

      // Set the default fields
      newUser.ProfileId = veteranUserId;
      newUser.TimeZoneSidKey = (String) userMap.get('TimeZoneSidKey');
      newUser.LocaleSidKey = (String) userMap.get('LocaleSidKey');
      newUser.EmailEncodingKey = (String) userMap.get('EmailEncodingKey');
      newUser.LanguageLocaleKey = (String) userMap.get('LanguageLocaleKey');
      newUser.IsActive = (Boolean) userMap.get('IsActive');

      // Insert the user
      insert newUser;

      System.resetPassword(newUser.Id, true);

      // Return the user Id
      return newUser.Id;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static String createPersonAccount(String accountJson, String userId) {
    try {
      // Deserialize the JSON string into a Map
      Map<String, Object> accountMap = (Map<String, Object>) JSON.deserializeUntyped(
        accountJson
      );

      // Create the Person Account record
      Account personAccount = new Account();

      // Set the IsPersonAccount field - note this is required for Person Accounts
      personAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName()
        .get('PersonAccount')
        .getRecordTypeId();

      List<String> keys = new List<String>{
        'Military_Branch__c',
        'Discharge_Status__c',
        'Phone'
        //, 'SSN__c'
        // field only currently available in prod. Will be added back later.
      };

      for (String key : keys) {
        personAccount.put(key, (String) accountMap.get(key));
      }

      String serviceDateString = (String) accountMap.get('parsedStartDate');
      String serviceEndString = (String) accountMap.get('parsedEndDate');

      personAccount.put('Service_Date_Start__c', Date.parse(serviceDateString));
      personAccount.put('Service_Date_End__c', Date.parse(serviceEndString));

      // Get User information to set on the Person Account
      User user = [
        SELECT Id, FirstName, LastName, Email
        FROM User
        WHERE Id = :userId
        LIMIT 1
      ];

      // Set Person fields - these field names are for Person Accounts
      personAccount.put('FirstName', user.FirstName);
      personAccount.put('LastName', user.LastName);
      personAccount.put('PersonEmail', user.Email);

      // Sets the Owner to be the user. Because we have to use internal licenses, we are setting it up to have each user have one account that they own that represents them.
      personAccount.put('OwnerId', userId);

      insert personAccount;

      return personAccount.Id;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}