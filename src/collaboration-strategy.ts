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
        let result = this.strategy.execute(current, backlog, teamSize).assignments;

        while (member.leq(teamSize)) {
            if (!result.isAssigned(member)) {
                let candidates = result.assignments
                    .filter(assignment => assignment.assignees.length > 0)
                    .sort((x, y) => x.assignees.length - y.assignees.length);
                
                if (candidates.length > 0) {
                    result = result.assign(member, candidates[0].batch);
                }
            }

            member = member.next();
        }

        return {
            assignments: result,
            backlog: backlog
        };
    }

}

export { CollaborationStrategy }