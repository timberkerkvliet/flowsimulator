import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { WorkAssignment, WorkAssignments } from "./work-assignment";
import { Backlog } from "./backlog";
import { equalIntervalBreaks, min } from "simple-statistics";

type StrategyExecutionResult = {
    assignments: WorkAssignments,
    backlog: Backlog,
    success: boolean
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
        return this.options
        .map(option => [option, ...this.choose(option).resolve()])
        .sort((x, y) => y.length - x.length)[0]
    }

}

class Strategy {
    constructor(
        private readonly props: {
            batchSize: PositiveInteger,
            wipLimit: PositiveInteger
        }
    ) {}

    execute(
        current: WorkAssignments,
        backlog: Backlog,
        teamSize: PositiveInteger
    ): StrategyExecutionResult {
        let result = current.unassignAll();

        let candidates = result.assignments
                .filter(assignment => assignment.assignees.length === 0)
                .map(assignment => assignment.batch)

        if (result.number.lessThan(this.props.wipLimit)) {
            const newBatch = new BatchOfWork(backlog.topOfBacklog(this.props.batchSize));
            candidates = [newBatch, ...candidates];
        }

        const matrix = new ChoiceMatrix(candidates, result.unassigned(teamSize));
        const options = matrix.resolve();

        for (const option of options) {
            result = result.assign(option.member, option.batch);
            backlog = backlog.remove(result.unitsOfWork, teamSize);
        }
        
        let member = PositiveInteger.fromNumber(1);

        while (member.leq(teamSize)) {
            if (!result.isAssigned(member)) {
                let candidates = result.assignments
                    .filter(assignment => assignment.assignees.length > 0)
                    .filter(assignment => assignment.batch.canCollaborate)
                    .sort((x, y) => y.assignees.length - x.assignees.length);
                
                if (candidates.length > 0) {
                    result = result.assign(member, candidates[0].batch);
                }
            }

            member = member.next();
        }
        

        return {
            assignments: result,
            backlog: backlog.remove(result.unitsOfWork, teamSize),
            success: true
        };
    }
}

export { Strategy }
