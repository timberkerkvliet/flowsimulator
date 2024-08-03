import { Team } from "./team";
import { UnitOfWork } from "./uow"
import { Renderer } from "./renderer"

class SimulationState {
    constructor(
    readonly time: number,
    readonly workInProgress: UnitOfWork[],
    readonly finishedWork: UnitOfWork[]
    ) {}
}


class Simulation {
    private state: SimulationState;
    constructor(team: Team, private renderer: Renderer) {
        this.state = new SimulationState(
            0,
            [],
            []
        )
    }

    private tick(): void {
        this.state.workInProgress.forEach((uow) => uow.tick());
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