import { max, min, sum } from "simple-statistics"
import { PositiveInteger } from "./positive-integer"
import { Task } from "./task"

class UnitOfWork {
    constructor(public readonly tasks: Task[]) {}

    public start(time: PositiveInteger): UnitOfWork {
        return new UnitOfWork(
            this.tasks.map(task => task.start(time))
        );
    }

    progress(time: PositiveInteger, assigness: PositiveInteger[]): UnitOfWork {
        if (!this.hasStarted) {
            this.start(time);
        }

        const tasks = this.tasks;
        const notDoneIndex = tasks.findIndex(unit => unit.canBeProgressedBy(assigness))

        if (assigness.length > 0 && notDoneIndex === -1) {
            console.log("No progress")
        }

        return new UnitOfWork(
            tasks.map((unit, index) => 
                index === notDoneIndex ? unit.progress(time, assigness): unit
            )
        );
    }


    public canBeProgressedBy(assignees: PositiveInteger[]): boolean {
        return this.tasks.filter(task => task.canBeProgressedBy(assignees)).length > 0;
    }


    public get canCollaborate(): boolean {
        return this.tasks.filter(task => task.canCollaborate).length > 0;
    }

    public get membersNeeded(): PositiveInteger[] {
        const values = this.tasks
            .filter(unit => !unit.isDone())
            .map(unit => unit.needsMember.value)
        const s = new Set(values)
        return [...s].map(x => PositiveInteger.fromNumber(x));
    }

    public get id(): string {
        return this.tasks.map(task => task.id).join("-");
    }

    public get timeDone(): PositiveInteger {
        return PositiveInteger.fromNumber(
            max(this.tasks.map(unit => unit.timeDone.value))
        );
    }

    public get timeStart(): PositiveInteger {
        return PositiveInteger.fromNumber(
            min(this.tasks.map(unit => unit.timeStart.value))
        );
    }

    public get isDone(): boolean {
        return this.tasks.map(task => task.isDone()).every(x => x);
    }

    public get hasStarted(): boolean {
        return this.tasks.map(unit => unit.hasStarted()).every(x => x);
    }

    public get timeInProgress(): PositiveInteger {
        return this.timeDone.minus(this.timeStart);
    }

    public get size(): PositiveInteger {
        return PositiveInteger.fromNumber(this.tasks.length);
    }

    public get utilization(): number {
        return sum(this.tasks.map(task => task.utilization))
    }

    public equals(batch: UnitOfWork): boolean {
        return this.id === batch.id;
    }

}

export { UnitOfWork }