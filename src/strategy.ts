import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { WorkAssignment, WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";

type StrategyExecutionResult = {
    assignments: WorkAssignments,
    backlog: Backlog
}

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
    ): StrategyExecutionResult {
        if (current.assignees().find(member => member.equals(teamMember))) {
            return {assignments: current, backlog: backlog};
        }
        if (current.number().geq(this.props.wipLimit)) {
            return {assignments: current, backlog: backlog};
        }

        const batch = new BatchOfWork(backlog.topOfBacklog(this.props.batchSize));
        const newBacklog = backlog.remove(batch.unitsOfWork);

        return {
            assignments: current.add(
                new WorkAssignment(
                    {
                        batch,
                        assignees: [teamMember]
                    }
                )
            ),
            backlog: newBacklog
        }

    }

    execute(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger
    ): StrategyExecutionResult {
        let member = PositiveInteger.fromNumber(1);
        let result = {
            assignments: current,
            backlog
        }
        while (member.leq(teamSize)) {
            result = this.optimizeFor(result.assignments, result.backlog, member);
            member = member.next();
        }

        return result;
    }
}

export { Strategy }
