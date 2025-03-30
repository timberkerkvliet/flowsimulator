import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { UnitOfWork } from "./unit-of-work";

class WorkAssignment {
    constructor(
        private readonly props: {
            batch: BatchOfWork,
            assignees: PositiveInteger[]
        }
    ) {}
    
    batch(): BatchOfWork {
        return this.props.batch;
    }

    progress(time: PositiveInteger): WorkAssignment {
        return new WorkAssignment(
            {
                ...this.props,
                batch: this.props.batch.progress(time, this.props.assignees)
            }
        )
    }

}

class WorkAssignments {
    constructor(
        private readonly props: {
            assignments: WorkAssignment[]
        }
    ) {}
    
    number(): PositiveInteger {
        return PositiveInteger.fromNumber(this.props.assignments.length);
    }

    batches(): BatchOfWork[] {
        return this.props.assignments.map(assignment => assignment.batch())
    }

    units(): UnitOfWork[] {
        return this.props.assignments
        .map(assignment => assignment.batch().unitsOfWork)
        .reduce((acc, val) => acc.concat(val), [])
    }

    getDone(): BatchOfWork[] {
        return this.props.assignments
            .map(assignment => assignment.batch())
            .filter(batch => batch.isDone());
    }

    removeDone(): WorkAssignments {
        return new WorkAssignments(
            {
                assignments: this.props.assignments
                    .filter(assignment => !assignment.batch().isDone())
            }
        );
    }

    progress(time: PositiveInteger): WorkAssignments {
        return new WorkAssignments(
            {
                assignments: this.props.assignments.map(assignment => assignment.progress(time))
            }
        )
    }

}

export { WorkAssignment, WorkAssignments }