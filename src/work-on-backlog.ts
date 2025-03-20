import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work";

class WorkOnBacklog {
    constructor(
        private readonly props: {
            unitsOfWork: UnitOfWork[],
            currentTime: PositiveInteger,
            unitOfWorkFactory: UnitOfWorkFactory,
            size: PositiveInteger
        }
    ) { }

    public everything(): UnitOfWork[] {
        return this.props.unitsOfWork;
    }

    public withWorkFactory(factory: UnitOfWorkFactory) {
        return new WorkOnBacklog(
            {
                ...this.props,
                unitOfWorkFactory: factory
            }
        )
    }

    public static newBacklog(unitOfWorkFactory: UnitOfWorkFactory, size: PositiveInteger): WorkOnBacklog {
        const time = PositiveInteger.fromNumber(1);
        return new WorkOnBacklog(
            {
                unitsOfWork: Array.from({ length: size.getValue() }, () => unitOfWorkFactory.create(time)),
                currentTime: time,
                unitOfWorkFactory,
                size: size
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
                unitsOfWork: [
                    ...this.props.unitsOfWork.slice(n.getValue()),
                    ...Array.from(
                        { length: n.getValue() },
                        () => this.props.unitOfWorkFactory.create(this.props.currentTime)
                    )
                ]
            }
        )
    }

    public size(): PositiveInteger {
        return this.props.size;
    }

    public tick(): WorkOnBacklog {
        const time = this.props.currentTime.next();
        return new WorkOnBacklog(
            {
                ...this.props,
                currentTime: time
            }
        )
    }

}

export { WorkOnBacklog }
