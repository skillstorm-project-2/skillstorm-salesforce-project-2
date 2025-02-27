trigger ClaimRecordTrigger on Case (before insert) {

    if (Trigger.isBefore && Trigger.isInsert) {
        QueueableObjectHandler.handleQueueableRecord(Trigger.new, Trigger.oldMap, new ClaimQueueProcessor());
    }
}