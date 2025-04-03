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
        teamSize: PositiveInteger
    ): StrategyExecutionResult {
        let result = current.findAssignmentThatNeedsMe(teamMember);
        if (result !== undefined) {
            return {assignments: current.assign(teamMember, result.batch), backlog: backlog};
        }

        if (current.number.geq(this.props.wipLimit)) {
            result = current.findAssignmentWithLowOccupation();
            
            return {assignments: current.assign(teamMember, result.batch), backlog: backlog};
        }

        const batch = new BatchOfWork(backlog.topOfBacklog(this.props.batchSize));
        const newBacklog = backlog.remove(batch.unitsOfWork, teamSize);

        if (batch.canBeProgressedBy([teamMember])) {
            return {
                assignments: current.assign(teamMember, batch),
                backlog: newBacklog
            }
        }

        return {assignments: current, backlog: backlog};

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
            result = this.optimizeFor(result.assignments, result.backlog, member, teamSize);
            member = member.next();
        }
        while (member.leq(teamSize)) {
            result = this.optimizeFor(result.assignments, result.backlog, member, teamSize);
            member = member.next();
        }

        return result;
    }
}

export { Strategy }
