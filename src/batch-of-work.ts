import { max, min } from "../node_modules/simple-statistics/index"
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work"

class BatchOfWork {
    constructor(public readonly unitsOfWork: UnitOfWork[]) {}

    start(time: PositiveInteger): BatchOfWork {
        return new BatchOfWork(
            this.unitsOfWork.map(unit => unit.start(time))
        );
    }

    progress(time: PositiveInteger, assigness: PositiveInteger[], teamSize: PositiveInteger): BatchOfWork {
        const unitsOfWork = this.unitsOfWork;
        const notDoneIndex = unitsOfWork.findIndex(unit => unit.canBeProgressedBy(assigness))

        if (assigness.length > 0 && notDoneIndex === -1) {
            console.log("No progress")
        }

        return new BatchOfWork(
            unitsOfWork.map((unit, index) => 
                index === notDoneIndex ? unit.progress(time, assigness, teamSize): unit
            )
        );
    }

    public get canCollaborate(): boolean {
        return this.unitsOfWork.filter(unit => unit.canCollaborate).length > 0;
    }

    public get membersNeeded(): PositiveInteger[] {
        const values = this.unitsOfWork
            .filter(unit => !unit.isDone())
            .map(unit => unit.needsMember.value)
        const s = new Set(values)
        return [...s].map(x => PositiveInteger.fromNumber(x));
    }

    public get id(): string {
        return this.unitsOfWork.map(unit => unit.id).join("-");
    }

    public get timeDone(): PositiveInteger {
        return PositiveInteger.fromNumber(
            max(this.unitsOfWork.map(unit => unit.timeDone.value))
        );
    }

    public get timeStart(): PositiveInteger {
        return PositiveInteger.fromNumber(
            min(this.unitsOfWork.map(unit => unit.timeStart.value))
        );
    }

    public get isDone(): boolean {
        return this.unitsOfWork.map(unit => unit.isDone()).every(x => x);
    }

    public get hasStarted(): boolean {
        return this.unitsOfWork.map(unit => unit.hasStarted()).every(x => x);
    }

    public get timeInProgress(): PositiveInteger {
        return this.timeDone.minus(this.timeStart);
    }

    public get size(): PositiveInteger {
        return PositiveInteger.fromNumber(this.unitsOfWork.length);
    }

    public equals(batch: BatchOfWork): boolean {
        return this.id === batch.id;
    }

}

export { BatchOfWork }