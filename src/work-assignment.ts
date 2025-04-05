import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { UnitOfWork } from "./unit-of-work";


class WorkAssignment {
    public readonly batch: BatchOfWork
    public readonly assignees: PositiveInteger[]

    constructor(private readonly props: {
        batch: BatchOfWork,
        assignees: PositiveInteger[]
    }) {
        this.batch = props.batch;
        this.assignees = props.assignees;
    }

    public isAssigned(teamMember: PositiveInteger) {
        return this.assignees.filter(assignee => assignee.equals(teamMember)).length > 0;
    }

    public canBeProgressedWithout(teamMember: PositiveInteger) {
        if (!this.isAssigned(teamMember)) {
            return true;
        }

        if (!this.batch.canBeProgressedBy(this.assignees)) {
            return true;
        }

        const without = this.assignees.filter(assignee => !assignee.equals(teamMember));

        return this.batch.canBeProgressedBy(without);
    }

    public canBeProgressedWith(member: PositiveInteger): boolean {
        const updatedAssigneeValues = [...this.assignees, member];

        return this.batch.canBeProgressedBy(updatedAssigneeValues);
    }

    assign(member: PositiveInteger): WorkAssignment {
        return new WorkAssignment(
            {...this.props, assignees: [...this.assignees, member]}
        )
    }

    unassign(member: PositiveInteger): WorkAssignment {
        return new WorkAssignment(
            {...this.props, assignees: this.assignees.filter(assignee => !assignee.equals(member))}
        )
    }

    start(time: PositiveInteger): WorkAssignment {
        return new WorkAssignment(
            {
                ...this.props,
                batch: this.batch.start(time)
            }
        )
    }

    progress(time: PositiveInteger, teamSize: PositiveInteger): WorkAssignment {
        return new WorkAssignment(
            {
                ...this.props,
                batch: this.batch.progress(time, this.assignees, teamSize)
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

    public get assignments(): WorkAssignment[] { return this.props.assignments; }
    
    public get number(): PositiveInteger {
        return PositiveInteger.fromNumber(this.assignments.length);
    }

    public get unitsOfWork(): UnitOfWork[] {
        return this.assignments
            .map(assignment => assignment.batch.unitsOfWork)
            .reduce((acc, val) => acc.concat(val), []);
    }

    public isAssigned(teamMember: PositiveInteger): boolean {
        return this.assignments.filter(assignment => assignment.isAssigned(teamMember)).length > 0;
    }

    public get assignees(): PositiveInteger[] {
        return this.assignments
            .map(assignment => assignment.assignees)
            .reduce((acc, val) => acc.concat(val), []);
    }

    public assignedToWorkThatCanBeProgressedWithout(teamMember: PositiveInteger): boolean {
        return this.assignments.every(
            assignment => assignment.canBeProgressedWithout(teamMember)
        );
    }

    add(assignment: WorkAssignment): WorkAssignments {
        return new WorkAssignments({assignments: [...this.assignments, assignment]})
    }

    assign(member: PositiveInteger, batch: BatchOfWork): WorkAssignments {
        const batchIndex = this.assignments.findIndex(assignment => assignment.batch.equals(batch));
        let assignments = this.assignments;

        assignments = assignments.map(assignment => assignment.unassign(member));

        if (batchIndex === -1) {
            assignments = [...assignments, new WorkAssignment({batch, assignees: [member]})];
        } else {
            assignments[batchIndex] = assignments[batchIndex].assign(member)
        }
        
        return new WorkAssignments({assignments});
    }

    unassign(member: PositiveInteger): WorkAssignments {
        return new WorkAssignments(
            {assignments: this.assignments.map(assignment => assignment.unassign(member))});
    }

    public get batchesDone(): BatchOfWork[] {
        return this.assignments
            .map(assignment => assignment.batch)
            .filter(batch => batch.isDone);
    }

    removeDone(): WorkAssignments {
        return new WorkAssignments(
            {
                assignments: this.assignments
                    .filter(assignment => !assignment.batch.isDone)
            }
        );
    }

    start(time: PositiveInteger): WorkAssignments {
        return new WorkAssignments(
            {
                assignments: this.assignments
                .map(assignment => assignment.batch.hasStarted ? assignment : assignment.start(time))
            }
        )
    }

    progress(time: PositiveInteger, teamSize: PositiveInteger): WorkAssignments {
        return new WorkAssignments(
            {
                assignments: this.assignments.map(assignment => assignment.progress(time, teamSize))
            }
        )
    }

}

export { WorkAssignment, WorkAssignments }