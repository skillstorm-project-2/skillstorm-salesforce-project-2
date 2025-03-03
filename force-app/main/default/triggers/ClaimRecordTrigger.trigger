trigger ClaimRecordTrigger on Case (before insert) {
    if (ClaimTestTriggerControl.isTest) {
        return;
    }

    if (Trigger.isBefore && Trigger.isInsert) {
        QueueableObjectHandler.handleQueueableRecord(Trigger.new, Trigger.oldMap, new ClaimQueueProcessor());
    }
}