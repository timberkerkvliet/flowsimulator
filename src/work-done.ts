import { sum } from "../node_modules/simple-statistics/index";
import { BatchOfWork } from "./batch-of-work"
import { PositiveInteger } from "./positive-integer";

class WorkDone {
    constructor(
        private readonly props: {
            work: BatchOfWork[],
            time: PositiveInteger
        }
    ) {}

    public tick(): WorkDone {
        return new WorkDone({...this.props, time: this.props.time.next()})
    }

    public everything(): BatchOfWork[] {
        return this.props.work;
    }

    public finish(batchesOfWork: BatchOfWork[]) {
        return new WorkDone(
            {
                ...this.props,
                work: [...batchesOfWork, ...this.props.work]
            }
        )
    }

    public averageCycleTime(): number {
        return sum(this.props.work.map(
            batch => batch.timeInSystem().getValue()
        ))/this.props.work.length;
    }

    public averageProccessingDuration(): number {
        return sum(this.props.work.map(
            batch => batch.timeInProgress().getValue()
        ))/this.props.work.length;
    }

    public throughPut(): number {
        return sum(this.props.work.map(batch => batch.size().getValue()))/this.props.time.getValue();
    }

}

export { WorkDone }