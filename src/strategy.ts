import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { WorkAssignment, WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";

class Strategy {
    constructor(
        private readonly props: {
            batchSize: PositiveInteger
        }
    ) {}

    execute(current: WorkAssignments, backlog: Backlog): WorkAssignments {
        if (current.number().equals(PositiveInteger.fromNumber(1))) {
            return current
        }

        return new WorkAssignments(
            {
                assignments: [
                    new WorkAssignment(
                        {
                            assignees: [PositiveInteger.fromNumber(1)],
                            batch: new BatchOfWork(backlog.topOfBacklog(this.props.batchSize))
                        }
                    )
                ]
            }
        )

    }
}

export { Strategy }
