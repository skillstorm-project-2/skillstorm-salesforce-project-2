trigger ClaimRecordTrigger on Case (before insert, before update) {

    if (Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)) {
        QueueableObjectHandler.handleQueueableRecord(Trigger.new);
    }
}