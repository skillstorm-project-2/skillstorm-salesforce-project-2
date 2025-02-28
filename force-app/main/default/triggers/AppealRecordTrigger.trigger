trigger AppealRecordTrigger on Appeal__c (before insert) {
    if (Trigger.isBefore && Trigger.isInsert) {
        QueueableObjectHandler.handleQueueableRecord(Trigger.new, Trigger.oldMap, new AppealQueueProcessor());
    }
}