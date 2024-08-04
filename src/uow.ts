import { Team, Perspective } from "./team";

class IdCounter {
    private static counter = 0;

    public static newId(): number {
        return IdCounter.counter;
        IdCounter.counter += 1;
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

    constructor(readonly perspectivesNeeded: Perspective[]) {
        this.id = `uow-${IdCounter.newId()}`;
        this.progress = 0;
        this.time = 0;
        this.assignees = new Team([]);
    }

    getId(): string {
        return this.id;
    }

    isFinished(): boolean {
        return this.progress === this.perspectivesNeeded.length;
    }

    getCycleTime(): number {
        return this.time;
    }

    tick(): void {
        if (this.isFinished()) {
            return;
        }
        this.time += 1;
        if (this.assignees.getSize() === 0) {
            return;
        }
        this.progress += 1;
    }

    assign(team: Team): void {
        this.assignees = team;
    }

    unassign(): void {
        this.assignees = new Team([]);
    }

    getProgress(): number {
        return this.progress / this.perspectivesNeeded.length;
    }

    getAssignees(): Team {
        return this.assignees;
    }

}

export { UnitOfWork, ReadUnitOfWork }