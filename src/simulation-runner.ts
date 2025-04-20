import { Renderer } from "./renderer"
import { Team } from "./team";


class TeamSimulation {
    constructor(
        public readonly team: Team,
        public readonly renderer: Renderer
    ) {}

    tick(): TeamSimulation {
        return new TeamSimulation(this.team.tick(), this.renderer);
    }

    render() {
        this.renderer.render(this.team);
    }
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
            await this.tick();
            await new Promise(resolve => setTimeout(resolve, this.sleepTime));
        }
    }

    private async tick() {
        this.teamSimulations = this.teamSimulations.map(
            simulation => simulation.tick()
        );
        this.teamSimulations.forEach(simulation => simulation.render());
    }
}

export { SimulationRunner, TeamSimulation }