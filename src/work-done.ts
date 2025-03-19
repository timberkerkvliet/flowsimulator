import { median, average } from "../node_modules/simple-statistics/index";
import { BatchOfWork } from "./batch-of-work"
import { PositiveInteger } from "./positive-integer";
import { UnitOfWork } from "./unit-of-work";

class WorkDone {
    constructor(
        private readonly props: {
            work: UnitOfWork[],
            time: PositiveInteger
        }
    ) {}

    public tick(): WorkDone {
        return new WorkDone({...this.props, time: this.props.time.next()})
    }

    public everything(): UnitOfWork[] {
        return this.props.work;
    }

    public finish(batchOfWork: BatchOfWork) {
        return new WorkDone(
            {
                ...this.props,
                work: [...batchOfWork.unitsOfWork, ...this.props.work]
            }
        )
    }

    public medianCycleTime(): number {
        if (this.props.work.length === 0) {
            return NaN;
        }
        return median(this.props.work.map(
            unit => unit.timeInSystem().getValue()
        ));
    }

    public averageCycleTime(): number {
        if (this.props.work.length === 0) {
            return 0;
        }
        return average(this.props.work.map(
            batch => batch.timeInProgress().getValue()
        ));
    }

    public throughPut(): number {
        return this.props.work.length/this.props.time.getValue();
    }

}

export { WorkDone }