import { average, sum } from "../node_modules/simple-statistics/index";
import { BatchOfWork } from "./batch-of-work"
import { PositiveInteger } from "./positive-integer";
import { UnitOfWork } from "./unit-of-work";

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

    public everything(): UnitOfWork[] {
        return this.props.work.reduce((acc, val) => acc.concat(val.unitsOfWork), [])
    }

    public add(batchesOfWork: BatchOfWork[]) {
        let work = this.props.work;
        batchesOfWork.forEach(batch => work = [batch, ...work]);
        return new WorkDone(
            {
                ...this.props,
                work: work
            }
        )
    }

    public averageCycleTime(): number {
        if (this.props.work.length === 0) {
            return 0;
        }
        return average(this.props.work.map(
            batch => batch.timeInProgress.value
        ));
    }

    public throughPut(): number {
        return sum(this.props.work.map(batch => batch.size.value))/this.props.time.value * 4;
    }

    public utilization(): number {
        return sum(this.props.work.map(batch => batch.utilization))/this.props.time.value;
    }

}

export { WorkDone }