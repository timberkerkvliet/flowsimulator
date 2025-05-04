import { PositiveInteger } from "./positive-integer";
import { WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";
import { Strategy, StrategyExecutionResult } from "./strategy";

class CollaborationStrategy {
    constructor(private readonly strategy: Strategy) {}

    execute(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger
    ): StrategyExecutionResult {
        let member = PositiveInteger.fromNumber(1);
        const result = this.strategy.execute(current, backlog, teamSize);
        let assignments = result.assignments;

        while (member.leq(teamSize)) {
            if (!assignments.isAssigned(member)) {
                let candidates = assignments.assignments
                    .filter(assignment => assignment.assignees.length > 0)
                    .sort((x, y) => x.assignees.length - y.assignees.length);
                
                if (candidates.length > 0) {
                    assignments = assignments.assign(member, candidates[0].batch);
                }
            }

            member = member.next();
        }

        return {
            assignments,
            backlog: result.backlog
        };
    }

}

export { CollaborationStrategy }