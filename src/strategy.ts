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
        teamMember: PositiveInteger,
        time: PositiveInteger
    ): StrategyExecutionResult {
        if (current.assignees().find(member => member.equals(teamMember))) {
            return {assignments: current, backlog: backlog};
        }
        if (current.number().geq(this.props.wipLimit)) {
            const result = current.findAssignmentWithLowOccupation();
            return {assignments: current.assign(teamMember, result.batch(), time), backlog: backlog};
        }

        const batch = new BatchOfWork(backlog.topOfBacklog(this.props.batchSize));
        const newBacklog = backlog.remove(batch.unitsOfWork);

        return {
            assignments: current.assign(teamMember, batch, time),
            backlog: newBacklog
        }

    }

    execute(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger,
        time: PositiveInteger
    ): StrategyExecutionResult {
        let member = PositiveInteger.fromNumber(1);
        let result = {
            assignments: current,
            backlog
        }
        while (member.leq(teamSize)) {
            result = this.optimizeFor(result.assignments, result.backlog, member, time);
            member = member.next();
        }

        return result;
    }
}

export { Strategy }
