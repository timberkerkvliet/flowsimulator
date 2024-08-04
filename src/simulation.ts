import { Team } from "./team";
import { UnitOfWork, ReadUnitOfWork } from "./uow"
import { Renderer } from "./renderer"
import { Strategy } from "./strategy"

interface ReadSimulation {
    getWorkInProgress(): ReadUnitOfWork[]
    getFinishedWork(): ReadUnitOfWork[]
    getTime(): number;
}

class Simulation implements ReadSimulation {
    private time: number;
    private units: UnitOfWork[];


    constructor(private team: Team, private strategy: Strategy, private renderer: Renderer) {
        this.time = 0;
        this.units = [];
    }

    getTime(): number {
        return this.time;
    }

    getWorkInProgress(): UnitOfWork[] {
        return this.units.filter((uow) => !uow.isFinished())
    }

    getFinishedWork(): UnitOfWork[] {
        return this.units.filter((uow) => uow.isFinished())
    }

    private tick(): void {
        this.time += 1;
        this.units = this.getFinishedWork().concat(this.strategy.execute(this.team, this.getWorkInProgress()));
        
        this.units.forEach((uow) => {
            uow.tick();
        });
        this.renderer.render(this);
    }

    async run() {
        this.renderer.render(this);
        while (true) {
            this.tick();
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

}

export { Simulation, ReadSimulation }