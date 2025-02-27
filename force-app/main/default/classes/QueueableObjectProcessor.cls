public interface QueueableObjectProcessor {
    void process(List<Object> objects, Map<Id, SObject> oldMap);
}