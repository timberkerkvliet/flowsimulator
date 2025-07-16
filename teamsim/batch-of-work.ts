import { sum } from "simple-statistics";
import { PositiveInteger } from "./positive-integer";
import { UnitOfWork } from "./unit-of-work";

class BatchOfWork {
    constructor(public readonly unitsOfWork: UnitOfWork[]) {}


    public get isDone(): boolean {
        return this.unitsOfWork.map(unit => unit.isDone).every(x => x);
    }

    public get hasStarted(): boolean {
        return this.unitsOfWork.map(unit => unit.hasStarted).every(x => x);
    }

    public get id(): string {
        return this.unitsOfWork.map(unit => unit.id).join("/");
    }

    public equals(batch: BatchOfWork): boolean {
        return this.id === batch.id;
    }

    public get membersNeeded(): PositiveInteger[] {
        const values = this.unitsOfWork
            .map(unit => unit.membersNeeded.map(x => x.value))
            .reduce((acc, val) => acc.concat(val), []);
        const s = new Set(values)
        return [...s].map(x => PositiveInteger.fromNumber(x));
    }

    public get utilization(): number {
        return sum(this.unitsOfWork.map(unit => unit.utilization))
    }

    private start(time: PositiveInteger): BatchOfWork {
        return new BatchOfWork(
            this.unitsOfWork.map(unit => unit.start(time))
        );
    }

    progress(time: PositiveInteger, assigness: PositiveInteger[]): BatchOfWork {
        let result: BatchOfWork = this;
        if (!this.hasStarted) {
            result = result.start(time);
        }

        const units = result.unitsOfWork;
        const notDoneIndex = units.findIndex(unit => unit.canBeProgressedBy(assigness))

        if (assigness.length > 0 && notDoneIndex === -1) {
            console.log("No progress")
        }

        return new BatchOfWork(
            units.map((unit, index) => 
                index === notDoneIndex ? unit.progress(time, assigness): unit
            )
        );
    }
}

export { BatchOfWork }
