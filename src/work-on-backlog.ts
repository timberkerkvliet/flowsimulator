import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work";

class WorkOnBacklog {
    constructor(
        private readonly props: {
            unitsOfWork: UnitOfWork[],
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
                unitsOfWork: Array.from({ length: size.getValue() }, () => unitOfWorkFactory.create()),
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

    public remove(units: UnitOfWork[]): WorkOnBacklog {
        const ids = units.map(unit => unit.id());
        let unitsOfWork = this.props.unitsOfWork;
        unitsOfWork = unitsOfWork.filter(
            unit => !ids.includes(unit.id())
        )
        while (unitsOfWork.length < this.props.size.getValue()) {
            unitsOfWork = [...unitsOfWork, this.props.unitOfWorkFactory.create()]
        }

        return new WorkOnBacklog(
            {
                ...this.props,
                unitsOfWork
            }
        )
    }

}

export { WorkOnBacklog }
