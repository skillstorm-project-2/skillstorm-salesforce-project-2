public with sharing class AppealQueueProcessor extends AbstractQueueProcessor {

    public AppealQueueProcessor() {
        super('%_Appeals_Queue');
    }
    
    public override void process(List<Object> objects, Map<Id, SObject> oldMap) {

        Set<Id> claimIds = new Set<Id>();
        Map<Id, String> claimMilitaryBranches = new Map<Id, String>();

        for (Object obj : objects) {
            if (obj instanceof Appeal__c) {
                claimIds.add(((Appeal__c)obj).Claim__c);
            } else {
                throw new IllegalArgumentException('Object in list is not of type Appeal__c');
            }
        }

        List<Case> claims = [SELECT Id, Military_Branch__c FROM Case WHERE Id IN :claimIds];
        for (Case claim : claims) {
            claimMilitaryBranches.put(claim.Id, claim.Military_Branch__c);
        }

        for (Object obj : objects) {
            Appeal__c appeal = (Appeal__c) obj;

            Group queue = branchQueues.get(claimMilitaryBranches.get(appeal.Claim__c));

            if (queue != null) {
                // TODO: need to check if the claim is already assigned to a user
                appeal.OwnerId = queue.Id;
            } else {
                throw new NullPointerException();
            }
        }
    }
}