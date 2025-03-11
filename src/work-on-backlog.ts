import { BatchOfWorkFactory } from "./batch-of-work-factory";
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work";

class WorkOnBacklog {
    constructor(
        private readonly props: {
            unitsOfWork: UnitOfWork[],
            nextUnitOfWork: UnitOfWork,
            currentTime: PositiveInteger,
            batchOfWorkFactory: BatchOfWorkFactory
        }
    ) { }

    public everything(): UnitOfWork[] {
        return this.props.unitsOfWork;
    }

    public static newBacklog(batchOfWorkFactory: BatchOfWorkFactory): WorkOnBacklog {
        return new WorkOnBacklog(
            {
                unitsOfWork: [],
                nextUnitOfWork: batchOfWorkFactory.create(PositiveInteger.fromNumber(1)),
                currentTime: PositiveInteger.fromNumber(1),
                batchOfWorkFactory
            }
        )
    }

    public topOfBacklog(n: PositiveInteger): UnitOfWork[] {
        if (this.props.unitsOfWork.length === 0) {
            return undefined;
        }
        return this.props.unitsOfWork.slice(0, n.getValue());
    }

    public removeTopOfBacklog(n: PositiveInteger): WorkOnBacklog {
        return new WorkOnBacklog(
            {
                ...this.props,
                unitsOfWork: this.props.unitsOfWork.slice(n.getValue())
            }
        )
    }

    public size(): PositiveInteger {
        return PositiveInteger.fromNumber(this.props.unitsOfWork.length);
    }

    public tick(): WorkOnBacklog {
        const time = this.props.currentTime.next();
        
        if (this.props.nextUnitOfWork.timeOfArrival().getValue() > time.getValue()) {
            return new WorkOnBacklog(
                {
                    ...this.props,
                    currentTime: time,
                    unitsOfWork: this.props.unitsOfWork,
                    nextUnitOfWork: this.props.nextUnitOfWork
                }
            )
        }

        const unitsOfWork = [...this.props.unitsOfWork, this.props.nextUnitOfWork];
        const nextUnitOfWork = this.props.batchOfWorkFactory.create(time);
        return new WorkOnBacklog(
            {
                ...this.props,
                currentTime: time,
                unitsOfWork,
                nextUnitOfWork
            }
        )
    }

}

export { WorkOnBacklog }
