import { Team } from "./team";

class IdCounter {
    private static counter = 0;

    public static newId(): number {
        return IdCounter.counter;
        IdCounter.counter += 1;
    }

}

class UnitOfWork {
    private id: number;
    private progress: number;
    private assignees: Team;

    constructor() {
        this.id = IdCounter.newId();
        this.progress = 0;
        this.assignees = new Team();
    }

    getId() {
        return this.id;
    }

    isFinished(): boolean {
        return this.progress == 1;
    }

    tick(): void {
        if (this.assignees.getSize() == 0) {
            return;
        }
        this.progress += 0.1;
    }

    assign(team: Team): void {
        this.assignees = team;
    }

    getProgress(): number {
        return this.progress;
    }

    getAssignees(): Team {
        return this.assignees;
    }

}

export { UnitOfWork }