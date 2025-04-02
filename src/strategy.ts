import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { WorkAssignment, WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";

class Strategy {
    constructor(
        private readonly props: {
            batchSize: PositiveInteger,
            wipLimit: PositiveInteger
        }
    ) {}

    private optimizeFor(
        current: WorkAssignments,
        backlog: Backlog,
        teamMember: PositiveInteger
    ): WorkAssignments {
        if (current.assignees().find(member => member.equals(teamMember))) {
            return current;
        }
        if (current.number().geq(this.props.wipLimit)) {
            return current;
        }
        return current.add(
            new WorkAssignment(
                {
                    batch: new BatchOfWork(backlog.topOfBacklog(this.props.batchSize)),
                    assignees: [teamMember]
                }
            )
        )

    }

    execute(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger
    ): WorkAssignments {
        let member = PositiveInteger.fromNumber(1);
        let result = current;
        while (member.leq(teamSize)) {
            result = this.optimizeFor(result, backlog, member);
            member = member.next();
        }

        return result;
    }
}

export { Strategy }
