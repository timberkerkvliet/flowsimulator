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
    assignees(): PositiveInteger[] {
        return this.props.assignees;
    }

    assign(member: PositiveInteger, time: PositiveInteger): WorkAssignment {
        return new WorkAssignment(
            {batch: this.props.batch.start(time),
                assignees: [...this.props.assignees, member]}
                )
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

    assignees(): PositiveInteger[] {
        return this.props.assignments
            .map(assignment => assignment.assignees())
            .reduce((acc, val) => acc.concat(val), []);
    }

    units(): UnitOfWork[] {
        return this.props.assignments
        .map(assignment => assignment.batch().unitsOfWork)
        .reduce((acc, val) => acc.concat(val), [])
    }

    assignments(): WorkAssignment[] {
        return this.props.assignments;
    }

    findAssignmentWithLowOccupation(): WorkAssignment {
        return this.props.assignments.sort((x, y) => x.assignees.length - y.assignees.length)[0];
    }
    
    add(assignment: WorkAssignment): WorkAssignments {
        return new WorkAssignments({assignments: [...this.props.assignments, assignment]})
    }

    assign(member: PositiveInteger, batch: BatchOfWork, time: PositiveInteger): WorkAssignments {
        const index = this.props.assignments.findIndex(assignment => assignment.batch().equals(batch));
        let assignments = this.props.assignments;

        if (index === -1) {
            assignments = [...assignments, new WorkAssignment({batch: batch.start(time), assignees: [member]})];
            return new WorkAssignments({assignments});
        }

        assignments[index] = assignments[index].assign(member, time)
        return new WorkAssignments({assignments});
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