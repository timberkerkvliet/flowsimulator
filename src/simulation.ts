import { Team } from "./team";
import { UnitOfWork, ReadUnitOfWork } from "./uow"
import { Renderer, SimulationState } from "./renderer"
import { Strategy } from "./strategy"


class Simulation {
    private time: number;
    private cumulativeWIP: number;
    private units: UnitOfWork[];


    constructor(private team: Team, private strategy: Strategy, private renderer: Renderer) {
        this.time = 0;
        this.cumulativeWIP = 0;
        this.units = [];
    }

    getTime(): number {
        return this.time;
    }

    private getWorkInProgress(): UnitOfWork[] {
        return this.units.filter((uow) => !uow.isFinished())
    }

    private getFinishedWork(): UnitOfWork[] {
        return this.units.filter((uow) => uow.isFinished())
    }

    private getState(): SimulationState {
        const flow = this.getFinishedWork().length / this.getTime();
        const cycleTime = this.getFinishedWork().map((x) => x.getCycleTime()).reduce((x, y) => x + y, 0) / this.getFinishedWork().length;
        return {
            time: this.time,
            workInProgress: this.getWorkInProgress().map((uow) => {
                return {
                    id: uow.getId(),
                    progress: uow.getProgress(),
                    assignees: uow.getAssignees().getMembers().map((member) => member.label),
                    perspective: uow.needsPerspective()
                }
            }),
            flow: flow,
            cycleTime: cycleTime,
            wip: this.cumulativeWIP / this.time
        }
    }

    private tick(): void {

        this.units.forEach((uow) => {
            uow.tick();
        });

        this.units = this.getFinishedWork().concat(this.strategy.execute(this.team, this.getWorkInProgress()));
        
        
        this.time += 1;
        this.cumulativeWIP += this.getWorkInProgress().length;
    }

    async run() {
        this.renderer.render(this.getState());
        while (true) {
            this.tick();
            this.renderer.render(this.getState());
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

}

export { Simulation }