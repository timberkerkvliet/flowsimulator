import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work";

class Backlog {
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
        return new Backlog(
            {
                ...this.props,
                unitOfWorkFactory: factory
            }
        )
    }

    public static newBacklog(unitOfWorkFactory: UnitOfWorkFactory, size: PositiveInteger, teamSize: PositiveInteger): Backlog {
        const time = PositiveInteger.fromNumber(1);
        return new Backlog(
            {
                unitsOfWork: Array.from({ length: size.value }, () => unitOfWorkFactory.create(teamSize)),
                unitOfWorkFactory,
                size: size
            }
        )
    }

    public topOfBacklog(n: PositiveInteger): UnitOfWork[] {
        if (this.props.unitsOfWork.length === 0) {
            return undefined;
        }
        return this.props.unitsOfWork.slice(0, n.value);
    }

    public remove(units: UnitOfWork[], teamSize: PositiveInteger): Backlog {
        const ids = units.map(unit => unit.id);
        let unitsOfWork = this.props.unitsOfWork;
        unitsOfWork = unitsOfWork.filter(
            unit => !ids.includes(unit.id)
        )
        while (unitsOfWork.length < this.props.size.value) {
            unitsOfWork = [...unitsOfWork, this.props.unitOfWorkFactory.create(teamSize)]
        }

        return new Backlog(
            {
                ...this.props,
                unitsOfWork
            }
        )
    }

}

export { Backlog }
