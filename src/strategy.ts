import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";

type StrategyExecutionResult = {
    assignments: WorkAssignments,
    backlog: Backlog
}

type AssignOption = {
    batch: BatchOfWork,
    member: PositiveInteger
}

class ChoiceMatrix {
    private readonly options: AssignOption[]

    constructor(
        private readonly batches: BatchOfWork[],
        private readonly members: PositiveInteger[]
    ) {
        let options: AssignOption[] = [];
        for (const batch of this.batches) {
            for (const member of this.members) {
                if (batch.membersNeeded.filter(x => x.equals(member)).length > 0) {
                    options = [
                        ...options,
                        {batch, member}
                    ]
                }
            }
        }
        this.options = options;
        
    }

    private choose(option: AssignOption): ChoiceMatrix {
        return new ChoiceMatrix(
            this.batches.filter(batch => !batch.equals(option.batch)),
            this.members.filter(member => !member.equals(option.member))
        )
    }

    resolve(target: PositiveInteger): AssignOption[] {
        if (this.options.length === 0) {
            return [];
        }
    
        let best: AssignOption[] = [];
    
        for (const option of this.options) {
            const result = [option, ...this.choose(option).resolve(target.previous())];
            if (result.length >= target.value) {
                return result;
            }
            if (result.length > best.length) {
                best = result;
            }
        }
    
        return best;
    }    

}

class Strategy {
    constructor(
        private readonly props: {
            batchSize: PositiveInteger,
            wipLimit: PositiveInteger
        }
    ) {}

    private addCollaboration(current: WorkAssignments, teamSize: PositiveInteger): WorkAssignments {
        let member = PositiveInteger.fromNumber(1);
        let result = current;

        while (member.leq(teamSize)) {
            if (!result.isAssigned(member)) {
                let candidates = result.assignments
                    .filter(assignment => assignment.assignees.length > 0)
                    .filter(assignment => assignment.batch.canCollaborate)
                    .sort((x, y) => x.assignees.length - y.assignees.length);
                
                if (candidates.length > 0) {
                    result = result.assign(member, candidates[0].batch);
                }
            }

            member = member.next();
        }

        return result;
    }

    execute(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger
    ): StrategyExecutionResult {
        const space = this.props.wipLimit.minus(current.numberInProgress);

        backlog = backlog.ensureSize(this.props.batchSize.multiply(space.next()));

        let path = this.findPath(backlog, current, teamSize);

        let result = current.unassignAll();
        for (const option of path) {
            result = result.assign(option.member, option.batch);
        }
        
        result = this.addCollaboration(result, teamSize);

        return {
            assignments: result,
            backlog: backlog.remove(result.unitsOfWork)
        };
    }

    private findPath(
        backlog: Backlog,
        current: WorkAssignments,
        teamSize: PositiveInteger
    ): AssignOption[] {
        const space = this.props.wipLimit.minus(current.numberInProgress);

        let tempBacklog = backlog;
        let tempAssignments = current.unassignAll();

        for (let k = 0; k < space.value; k++) {
            const units = tempBacklog.topOfBacklog(this.props.batchSize);
            tempBacklog = tempBacklog.remove(units);
            tempAssignments = tempAssignments.addBatch(new BatchOfWork(units));
        }

        let candidates = tempAssignments.assignments
            .filter(assignment => assignment.assignees.length === 0)
            .map(assignment => assignment.batch);

        const matrix = new ChoiceMatrix(candidates, tempAssignments.unassigned(teamSize));
        return matrix.resolve(teamSize);
    }
}

export { Strategy }
