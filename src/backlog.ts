import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer"
import { UnitOfWork } from "./unit-of-work";

class Backlog {
    constructor(
        private readonly props: {
            unitsOfWork: UnitOfWork[],
            unitOfWorkFactory: UnitOfWorkFactory
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

    public static newBacklog(unitOfWorkFactory: UnitOfWorkFactory): Backlog {
        const time = PositiveInteger.fromNumber(1);
        return new Backlog(
            {
                unitsOfWork: [],
                unitOfWorkFactory
            }
        )
    }

    public ensureSize(verticalSize: PositiveInteger): Backlog {
        const missing = verticalSize.value - this.props.unitsOfWork.length;
        let newUnits = [];
        for (let k = 0; k < missing; k++) {
            newUnits = [this.props.unitOfWorkFactory.create(), ...newUnits]
        }

        return new Backlog(
            {
                ...this.props,
                unitsOfWork: [...this.props.unitsOfWork, ...newUnits]
            }
        )
    }

    public topOfBacklog(size: PositiveInteger): UnitOfWork[] {
        return this.props.unitsOfWork.slice(0, size.value);
    }

    public remove(units: UnitOfWork[]): Backlog {
        const ids = units.map(unit => unit.id);
        return new Backlog(
            {
                ...this.props,
                unitsOfWork: this.props.unitsOfWork.filter(
                    unit => !ids.includes(unit.id)
                )
            }
        )
    }

}

export { Backlog }
