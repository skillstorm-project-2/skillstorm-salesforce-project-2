public class QueueableObjectHandler {

    public static void handleQueueableRecord(List<Object> objects, Map<Id, SObject> oldMap, QueueableObjectProcessor processor) {
        processor.process(objects, oldMap);
    }
}