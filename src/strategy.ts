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

    resolve(): AssignOption[] {
        if (this.options.length === 0) {
            return [];
        }
    
        let best: AssignOption[] = [];
    
        for (const option of this.options) {
            const result = [option, ...this.choose(option).resolve()];
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
        let result = current.unassignAll();

        backlog = backlog.ensureSize(this.props.batchSize.multiply(this.props.wipLimit));

        let tempBacklog = backlog;

        const space = this.props.wipLimit.minus(result.numberInProgress);

        for (let k = 0; k < space.value; k++) {
            console.log(this.props.batchSize)
            const units = tempBacklog.topOfBacklog(this.props.batchSize);
            console.log(units);
            tempBacklog = tempBacklog.remove(units);
            result = result.addBatch(new BatchOfWork(units));
        }

        let candidates = result.assignments
            .filter(assignment => assignment.assignees.length === 0)
            .map(assignment => assignment.batch)
        
        const matrix = new ChoiceMatrix(candidates, result.unassigned(teamSize));
        let path = matrix.resolve();

        for (const option of path) {
            result = result.assign(option.member, option.batch);
        }
        
        result = result.cleanUp();
        result = this.addCollaboration(result, teamSize);

        return {
            assignments: result,
            backlog: backlog.remove(result.unitsOfWork)
        };
    }
}

export { Strategy }
