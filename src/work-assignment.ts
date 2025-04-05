import { min } from "simple-statistics";
import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";


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

    public canDoWithout(teamMember: PositiveInteger) {
        if (!this.isAssigned(teamMember)) {
            return true;
        }

        if (!this.batch.canBeProgressedBy(this.assignees)) {
            return true;
        }

        const without = this.assignees.filter(assignee => !assignee.equals(teamMember));

        return this.batch.canBeProgressedBy(without);
    }

    public canBeProgressed(): boolean {
        return this.batch.canBeProgressedBy(this.assignees);
    }

    public canBeProgressedWith(member: PositiveInteger): boolean {
        const updatedAssigneeValues = [...this.assignees, member];

        return this.batch.canBeProgressedBy(updatedAssigneeValues);
    }

    public canBeUnblockedBy(teamMember: PositiveInteger) {
        if (this.canBeProgressed()) {
            return false;
        }

        return this.canBeProgressedWith(teamMember);
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

    equals(assignment: WorkAssignment): boolean {
        if (!this.batch.equals(assignment.batch)) {
            return false;
        }
        if (this.assignees.length !== assignment.assignees.length) {
            return false;
        }
        const values = assignment.assignees.map(assignee => assignee.value);
        
        return this.assignees.every(assignee => values.includes(assignee.value));
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

    public isAssigned(teamMember: PositiveInteger): boolean {
        return this.assignments.filter(assignment => assignment.isAssigned(teamMember)).length > 0;
    }

    public get assignees(): PositiveInteger[] {
        return this.assignments
            .map(assignment => assignment.assignees)
            .reduce((acc, val) => acc.concat(val), []);
    }

    public assignedToWorkThatCanDoWithout(teamMember: PositiveInteger): boolean {
        return this.assignments.filter(
            assignment => assignment.isAssigned(teamMember)
        ).every(
            assignment => assignment.canDoWithout(teamMember)
        );
    }

    public findAssignmentThatNeedsMe(teamMember: PositiveInteger): WorkAssignment | undefined {
        const found = this.assignments
            .filter(
                assignment => assignment.canBeUnblockedBy(teamMember)
            );
        if (found.length === 0) {
            return undefined;
        }
        return found[0];
    }

    public findAssignmentFor(teamMember: PositiveInteger): WorkAssignment | undefined {
        let candidates = this.assignments
            .filter(assignment => assignment.canBeProgressedWith(teamMember))

        if (candidates.length === 0) {
            return undefined;
        }

        const minOccupation = min(candidates.map(assignment => assignment.assignees.length))
        return candidates.find(assignment => assignment.assignees.length === minOccupation);
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

    equals(assignments: WorkAssignments): boolean {
        if (!this.number.equals(assignments.number)) {
            return false;
        }
        return this.assignments.every(
            (assignment, index) => assignment.equals(assignments.assignments[index])
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