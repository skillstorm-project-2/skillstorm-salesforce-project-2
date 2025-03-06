public with sharing class AppealQueueProcessor extends AbstractQueueProcessor {

    public AppealQueueProcessor() {
        super('%_Appeals_Queue');

        Group inPersonQueue = [SELECT Id, Name FROM Group WHERE Type = 'Queue' AND Name='In Person'];
        Group higherReviewQueue = [SELECT Id, Name FROM Group WHERE Type = 'Queue' AND Name='Higher Review'];

        branchQueues.put('in_person', inPersonQueue);
        branchQueues.put('higher_review', higherReviewQueue);
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

            if (appeal.Request_for_Higher_Review__c) {
                Group queue = branchQueues.get('higher_review');

                assignToQueue(queue, appeal);
            } else if (appeal.Request_for_In_Person_Hearing__c) {
                Group queue = branchQueues.get('in_person');

                assignToQueue(queue, appeal);
            } else {
                Group queue = branchQueues.get(claimMilitaryBranches.get(appeal.Claim__c));

                assignToQueue(queue, appeal);
            }
        }
    }

    private void assignToQueue(Group queue, Appeal__c appeal) {

        System.debug('Queue: ' + queue);

        if (queue != null) {
            appeal.OwnerId = queue.Id;
        } else {
            throw new NullPointerException();
        }
    }
}