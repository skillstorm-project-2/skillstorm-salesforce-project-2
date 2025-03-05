public with sharing class AccountController {
  @AuraEnabled(cacheable=true)
  public static Account getAccountWithSSN(String accountId) {
    // Make sure to include the encrypted field using the proper API name
    return [
      SELECT Id, Name, PersonEmail, Phone, SSN__pc
      FROM Account
      WHERE Id = :accountId
      LIMIT 1
    ];
  }
}
