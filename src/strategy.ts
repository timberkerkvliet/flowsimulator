import { Member, Team } from "./team";
import { UnitOfWork } from "./uow";
import { UnitOfWorkFactory } from "./uow-factory";


interface Strategy {
    execute(team: Team, workInProgress: UnitOfWork[]): UnitOfWork[];
}

class KeepBusyStrategy implements Strategy {
    constructor(private uowFactory: UnitOfWorkFactory) {}

    getUnassigned(team: Team, workInProgress: UnitOfWork[]): Member[] {
        let assigned: Member[] = []
        workInProgress.forEach((uow) => {
            assigned = assigned.concat(uow.getAssignees().getMembers())
        })
        return team.getMembers().filter((member) => !assigned.includes(member))
    }

    execute(team: Team, workInProgress: UnitOfWork[]): UnitOfWork[] {
        workInProgress.forEach((uow) => {
            const members = uow.getAssignees().getMembers();
            members.forEach((member) => {
                if (!member.hasPerspective(uow.needsPerspective())) {
                    uow.removeMember(member);
                }
            })
        })
        
        const unassigned = this.getUnassigned(team, workInProgress);
        unassigned.forEach((member) => {
            const eligiableWork = workInProgress.filter(
                (uow) => member.hasPerspective(uow.needsPerspective()) && uow.getAssignees().getSize() === 0
                )
            if (eligiableWork.length > 0) {
                eligiableWork[0].addMember(member)
            } else {
                const newUow = this.uowFactory.create(member.perspectives[0]);
                newUow.addMember(member);
                workInProgress.push(newUow);
            }
        })

        

        return workInProgress;
    }
}


class MobStrategy implements Strategy {
    constructor(private uowFactory: UnitOfWorkFactory) {}

    getUnassigned(team: Team, workInProgress: UnitOfWork[]): Member[] {
        let assigned: Member[] = []
        workInProgress.forEach((uow) => {
            assigned = assigned.concat(uow.getAssignees().getMembers())
        })
        return team.getMembers().filter((member) => !assigned.includes(member))
    }

    execute(team: Team, workInProgress: UnitOfWork[]): UnitOfWork[] {
        if (workInProgress.length === 0) {
            const newUow = this.uowFactory.create(1);
                newUow.assign(team);
                workInProgress.push(newUow);
        }

        return workInProgress;
    }
}

export { Strategy, KeepBusyStrategy, MobStrategy }