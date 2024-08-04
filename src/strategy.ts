import { Team } from "./team";
import { UnitOfWork } from "./uow";
import { UnitOfWorkFactory } from "./uow-factory";


interface Strategy {
    execute(team: Team, workInProgress: UnitOfWork[]): UnitOfWork[];
}

class MobStrategy implements Strategy {
    constructor(private uowFactory: UnitOfWorkFactory) {}

    execute(team: Team, workInProgress: UnitOfWork[]): UnitOfWork[] {
        workInProgress.forEach((uow) => uow.unassign())
        if (workInProgress.length === 0) {
            const uow = this.uowFactory.create();
            workInProgress.push(uow)
        }
        workInProgress[0].assign(team);
        return workInProgress;
    }
}

export { Strategy, MobStrategy }