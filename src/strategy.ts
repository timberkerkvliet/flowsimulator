import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { WorkAssignment, WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";
import { min } from "simple-statistics";

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
        if (!current.assignedToWorkThatCanBeProgressedWithout(teamMember)) {
            return {assignments: current, backlog: backlog, success: true};
        }

        let result = current.unassign(teamMember);

        let candidates = result.assignments;

        if (result.number.lessThan(this.props.wipLimit)) {
            const batch = new BatchOfWork(backlog.topOfBacklog(this.props.batchSize));
            candidates = [new WorkAssignment({batch, assignees:[]}), ...candidates]
        }

        candidates = candidates
            .filter(assignment => assignment.canBeProgressedWith(teamMember))
            .sort((x, y) => x.assignees.length - y.assignees.length);

        if (candidates.length === 0) {
            return {assignments: result, backlog: backlog, success: false};
        }

        result = result.assign(teamMember, candidates[0].batch);

        return {
            assignments: result,
            backlog: backlog.remove(result.unitsOfWork, teamSize),
            success: true
        };
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
