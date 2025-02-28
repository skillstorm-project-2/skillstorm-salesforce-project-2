public abstract class AbstractQueueProcessor {

    protected Map<String, Group> branchQueues = new Map<String, Group>();
    List<String> branches = new List<String>{
        'Air Force',
        'Army',
        'Coast Guard',
        'Marine Corps',
        'Navy',
        'Space Force'
    };

    public AbstractQueueProcessor(String likeExpression) {
        List<Group> queues = [SELECT Id, Name FROM Group WHERE Type = 'Queue' AND Name LIKE :likeExpression];

        for (String branch : branches) {
            for (Group queue : queues) {
                if (queue.Name.contains(branch)) {
                    branchQueues.put(branch, queue);
                }
            }
        }
    }

    public Map<String,Group> getBranchQueues() {
        return branchQueues;
    }

    public abstract void process(List<Object> objects, Map<Id, SObject> oldMap);
}