import { max, min } from "../node_modules/simple-statistics/index"
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work"

class BatchOfWork {
    constructor(public readonly unitsOfWork: UnitOfWork[]) {}

    progress(time: PositiveInteger, assigness: PositiveInteger[]): BatchOfWork {
        const unitsOfWork = this.unitsOfWork;
        const notDoneIndex = unitsOfWork.findIndex(unit => !unit.isDone())

        return new BatchOfWork(
            unitsOfWork.map((unit, index) => 
                index === notDoneIndex ? unit.progress(time, assigness): unit
            )
        );
    }

    public timeDone(): PositiveInteger {
        return PositiveInteger.fromNumber(
            max(this.unitsOfWork.map(unit => unit.timeDone().getValue()))
        );
    }

    public timeStart(): PositiveInteger {
        return PositiveInteger.fromNumber(
            min(this.unitsOfWork.map(unit => unit.timeStart().getValue()))
        );
    }

    public isDone(): boolean {
        return this.unitsOfWork.map(unit => unit.isDone()).every(x => x);
    }

    public timeInProgress(): PositiveInteger {
        return this.timeDone().minus(this.timeStart());
    }

    public size(): PositiveInteger {
        return PositiveInteger.fromNumber(this.unitsOfWork.length);
    }

}

export { BatchOfWork }