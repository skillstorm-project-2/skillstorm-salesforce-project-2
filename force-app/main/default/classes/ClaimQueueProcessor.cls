public with sharing class ClaimQueueProcessor extends AbstractQueueProcessor{

    public ClaimQueueProcessor() {
        super('%_Claims_Queue');
    }
    
    public override void process(List<Object> objects, Map<Id, SObject> oldMap) {

        Set<Id> claimAccountIds = new Set<Id>();
        Map<Id, String> accountMilitaryBranches = new Map<Id, String>();

        for (Object obj : objects) {
            if (obj instanceof Case) {
                claimAccountIds.add(((Case)obj).AccountId);
            } else {
                throw new IllegalArgumentException('Object in list is not of type Case');
            }
        }

        List<Account> accounts = [SELECT Id, Military_Branch__c FROM Account WHERE Id IN :claimAccountIds];
        for (Account account : accounts) {
            accountMilitaryBranches.put(account.Id, account.Military_Branch__c);
        }

        for (Object obj : objects) {
            Case claim = (Case) obj;

            Group queue = branchQueues.get(accountMilitaryBranches.get(claim.AccountId));

            if (queue != null) {
                // TODO: need to check if the claim is already assigned to a user
                claim.OwnerId = queue.Id;
            } else {
                throw new NullPointerException();
            }
        }
    }
}