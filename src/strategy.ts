import { Team } from "./team";
import { UnitOfWork } from "./uow";

type Assignment = {
    team: Team
    unitOfWork: UnitOfWork
}

interface Strategy {
    execute(team: Team, workInProgress: UnitOfWork[]): UnitOfWork[];
}

class MobStrategy implements Strategy {
    execute(team: Team, workInProgress: UnitOfWork[]): UnitOfWork[] {
        workInProgress.forEach((uow) => uow.unassign())
        if (workInProgress.length === 0) {
            const uow = new UnitOfWork();
            uow.assign(team)
            workInProgress.push(uow)
        }
        return workInProgress;
    }
}

export { Strategy, MobStrategy }