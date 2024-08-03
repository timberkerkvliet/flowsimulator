import { Team } from "./team";
import { UnitOfWork } from "./uow"
import { Renderer } from "./renderer"
import { Strategy } from "./strategy"

class SimulationState {
    constructor(
    public time: number,
    public workInProgress: UnitOfWork[],
    public finishedWork: UnitOfWork[]
    ) {}
}


class Simulation {
    private state: SimulationState;
    constructor(private team: Team, private strategy: Strategy, private renderer: Renderer) {
        this.state = new SimulationState(
            0,
            [],
            []
        )
    }

    private tick(): void {
        this.state.time += 1;
        this.strategy.execute(this.team, this.state.workInProgress);
        
        this.state.workInProgress.forEach((uow) => {
            uow.tick();
            if (uow.isFinished()) {
                this.state.finishedWork.push(uow);
            }
        });
        this.state.workInProgress = this.state.workInProgress.filter((uow) => !uow.isFinished())
    }

    async run() {
        console.log("Start simulation!")
        this.renderer.render(this.state);
        while (true) {
            this.tick();
            this.renderer.render(this.state);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

}

export { Simulation, SimulationState}