import { Team, Perspective, Member } from "./team";

class IdCounter {
    private static counter = 0;

    public static newId(): number {
        IdCounter.counter += 1;
        return IdCounter.counter;
    }

}

interface ReadUnitOfWork {
    getId(): string;
    isFinished(): boolean;
    getProgress(): number;
    getAssignees(): Team;
    getCycleTime(): number;
}

class UnitOfWork implements ReadUnitOfWork {
    private id: string;
    private progress: number;
    private assignees: Team;
    private time: number;

    constructor(readonly stages: Perspective[]) {
        this.id = `uow-${IdCounter.newId()}`;
        this.progress = 0;
        this.time = 0;
        this.assignees = new Team([]);
    }

    getId(): string {
        return this.id;
    }

    isFinished(): boolean {
        return this.progress === this.stages.length;
    }

    getCycleTime(): number {
        return this.time;
    }

    needsPerspective(): Perspective {
        return this.stages[this.progress];
    }

    tick(): void {
        if (this.isFinished()) {
            this.unassign();
            return;
        }
        this.time += 1;
        if (this.assignees.hasPerspective(this.needsPerspective())) {
            this.progress += 1;
        }
    }

    assign(team: Team): void {
        this.assignees = team;
    }

    addMember(member: Member): void {
        this.assignees = new Team(this.assignees.getMembers().concat(member))
    }

    removeMember(member: Member): void {
        this.assignees = new Team(this.assignees.getMembers().filter((x) => x.label !== member.label))
    }

    unassign(): void {
        this.assignees = new Team([]);
    }

    getProgress(): number {
        return this.progress / this.stages.length;
    }

    getAssignees(): Team {
        return this.assignees;
    }

}

export { UnitOfWork, ReadUnitOfWork }