import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer"
import { Team } from "./team";
import { Strategy } from "./strategy";


type TeamSimulation = {
    team: Team,
    renderer: Renderer
}

class SimulationRunner {
    constructor(
        private teamSimulations: TeamSimulation[],
        private sleepTime: number,
        private stopped: boolean
    ) {}

    stop() {
        this.stopped = true;
    }

    async run() {
        while (!this.stopped) {
            this.teamSimulations = this.teamSimulations.map(
                simulation => {
                    return {
                        team: simulation.team.tick(),
                        renderer: simulation.renderer
                    }
                }
            )
            this.teamSimulations.forEach(simulation => simulation.renderer.render(simulation.team));
            await new Promise(resolve => setTimeout(resolve, this.sleepTime));
        }
    }

}

export { SimulationRunner }