import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { Task } from "./task";
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

    unassignAll(): WorkAssignment {
        return new WorkAssignment(
            {...this.props, assignees: []}
        )
    }

    progress(time: PositiveInteger): WorkAssignment {
        return new WorkAssignment(
            {
                ...this.props,
                batch: this.batch.progress(time, this.assignees)
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
    
    public get numberInProgress(): PositiveInteger {
        return PositiveInteger.fromNumber(
            this.assignments
                .filter(assignment => !assignment.batch.isDone)
                .length
        );
    }

    public get inProgress(): BatchOfWork[] {
        return this.assignments
            .filter(assignment => !assignment.batch.isDone)
            .map(assignment => assignment.batch)
    }

    public get unitsOfWork(): UnitOfWork[] {
        return this.assignments
            .map(assignment => assignment.batch.unitsOfWork)
            .reduce((acc, val) => acc.concat(val), []);
    }

    public get batchesOfWork(): BatchOfWork[] {
        return this.assignments
            .map(assignment => assignment.batch)
    }

    public isAssigned(teamMember: PositiveInteger): boolean {
        return this.assignments.filter(assignment => assignment.isAssigned(teamMember)).length > 0;
    }

    public get assignees(): PositiveInteger[] {
        return this.assignments
            .map(assignment => assignment.assignees)
            .reduce((acc, val) => acc.concat(val), []);
    }

    public unassigned(teamSize: PositiveInteger): PositiveInteger[] {
        let result = [];
        let member = PositiveInteger.fromNumber(1);
        while (member.leq(teamSize)) {
            if (!this.isAssigned(member)) {
                result = [...result, member];
            }
            member = member.next();
        }
        return result;
    }

    addBatch(batch: BatchOfWork): WorkAssignments {
        const batchIndex = this.assignments.findIndex(assignment => assignment.batch.isDone);

        let assignments = this.assignments;

        if (batchIndex === -1) {
            assignments = [...assignments, new WorkAssignment({batch, assignees: []})];
        } else {
            assignments[batchIndex] = new WorkAssignment({batch, assignees: []})
        }

        return new WorkAssignments({assignments});
    }

    cleanUp(): WorkAssignments {
        return new WorkAssignments(
            {
                assignments: this.assignments.filter(
                    assignment => assignment.batch.hasStarted || assignment.assignees.length > 0
                )
            }
        );
    }

    assign(member: PositiveInteger, batch: BatchOfWork): WorkAssignments {
        const batchIndex = this.assignments.findIndex(assignment => assignment.batch.equals(batch));
        let assignments = this.assignments;

        assignments = assignments.map(assignment => assignment.unassign(member));

        if (batchIndex === -1) {
            assignments = [new WorkAssignment({batch, assignees: [member]}), ...assignments];
        } else {
            assignments[batchIndex] = assignments[batchIndex].assign(member)
        }
        
        return new WorkAssignments({assignments});
    }

    unassignAll(): WorkAssignments {
        return new WorkAssignments(
            {assignments: this.assignments.map(assignment => assignment.unassignAll())});
    }

    public get batchesDone(): BatchOfWork[] {
        return this.assignments
            .map(assignment => assignment.batch)
            .filter(batch => batch.isDone);
    }

    public get unitsDone(): UnitOfWork[] {
        return this.assignments
            .map(assignment => assignment.batch)
            .filter(batch => batch.isDone)
            .map(batch => batch.unitsOfWork)
            .reduce((acc, val) => acc.concat(val), []);       
    }

    progress(time: PositiveInteger): WorkAssignments {
        return new WorkAssignments(
            {
                assignments: this.assignments.map(assignment => assignment.progress(time))
            }
        )
    }

}

export { WorkAssignment, WorkAssignments }