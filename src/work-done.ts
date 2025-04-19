import { average, sum } from "../node_modules/simple-statistics/index";
import { UnitOfWork } from "./unit-of-work"
import { PositiveInteger } from "./positive-integer";
import { Task } from "./task";

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

    public everything(): Task[] {
        return this.props.work.reduce((acc, val) => acc.concat(val.tasks), [])
    }

    public units(): UnitOfWork[] {
        return this.props.work;
    }

    public add(units: UnitOfWork[]) {
        let work = this.props.work;
        const existingIds = work.map(unit => unit.id);
        const newUnits = units.filter(unit => !existingIds.includes(unit.id))

        return new WorkDone(
            {
                ...this.props,
                work: [...newUnits, ...work]
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
        return sum(this.props.work.map(unit => unit.size.value))/this.props.time.value * 10;
    }

    public utilization(): number {
        return sum(this.props.work.map(unit => unit.utilization));
    }

}

export { WorkDone }