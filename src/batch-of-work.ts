import { sum } from "../node_modules/simple-statistics/index"
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work"

class BatchOfWork {
    constructor(public readonly unitsOfWork: UnitOfWork[]) {}

    startWork(time: PositiveInteger): BatchOfWork {
        return new BatchOfWork(
            this.unitsOfWork.map(unit => unit.startProcessing(time))
        )
    }

    endWork(time: PositiveInteger): BatchOfWork {
        return new BatchOfWork(
            this.unitsOfWork.map(unit => unit.endProcessing(time))
        )
    }

    public timeDone(): PositiveInteger {
        const totalProcessingTime = sum(
            this.unitsOfWork.map(unit => unit.processDuration().getValue())
        );

        return this.unitsOfWork[0].timeStartProcessing().add(
            PositiveInteger.fromNumber(totalProcessingTime)
        );
    }

    public timeInSystem(): PositiveInteger {
        return PositiveInteger.fromNumber(sum(
            this.unitsOfWork.map(
                unit => unit.timeInSystem().getValue()
            )
        ));
    }

    public timeInProgress(): PositiveInteger {
        return this.unitsOfWork[0].timeInProgress();
    }

    public size(): PositiveInteger {
        return PositiveInteger.fromNumber(this.unitsOfWork.length);
    }

    public slize(): BatchOfWork[] {
        return this.unitsOfWork.map(
            unit => new BatchOfWork([unit])
        )
    }

}

export { BatchOfWork }