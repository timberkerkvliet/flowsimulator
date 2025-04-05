import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { WorkAssignment, WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";

type StrategyExecutionResult = {
    assignments: WorkAssignments,
    backlog: Backlog,
    success: boolean
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
        if (!current.assignedToWorkThatCanDoWithout(teamMember)) {
            return {assignments: current, backlog: backlog, success: true};
        }

        let result = current.findAssignmentThatNeedsMe(teamMember);
        if (result !== undefined) {
            return {assignments: current.assign(teamMember, result.batch), backlog: backlog, success: true};
        }

        const batch = new BatchOfWork(backlog.topOfBacklog(this.props.batchSize));

        if (batch.canBeProgressedBy([teamMember]) && current.number.lessThan(this.props.wipLimit)) {
            return {
                assignments: current.assign(teamMember, batch),
                backlog: backlog.remove(batch.unitsOfWork, teamSize),
                success: true
            }
        }

        result = current.findAssignmentFor(teamMember);
        
        if (result === undefined) {
            return {assignments: current, backlog: backlog, success: false};
        }
        
        return {assignments: current.assign(teamMember, result.batch), backlog: backlog, success: true};

    }

    private iteration(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger
    ): StrategyExecutionResult {
        let result = {
            assignments: current,
            backlog,
            success: false
        }
        let member = PositiveInteger.fromNumber(1);
        let success = true;
        while (member.leq(teamSize)) {
            result = this.optimizeFor(result.assignments, result.backlog, member, teamSize);
            if (!result.success) {
                success = false; 
            }
            member = member.next();
        }
        return {assignments: result.assignments, backlog: result.backlog, success};
    }

    execute(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger
    ): StrategyExecutionResult {
        let result = {
            assignments: current,
            backlog,
            success: false
        }

        while (!result.success) {
            result = this.iteration(result.assignments, result.backlog, teamSize);
        }

       return result;
    }
}

export { Strategy }
