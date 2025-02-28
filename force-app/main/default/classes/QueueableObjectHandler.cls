public class QueueableObjectHandler {

    public static void handleQueueableRecord(List<Object> objects, Map<Id, SObject> oldMap, AbstractQueueProcessor processor) {
        processor.process(objects, oldMap);
    }
}