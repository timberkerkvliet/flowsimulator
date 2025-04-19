import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer"
import { Team } from "./team";
import { Strategy } from "./strategy";
import { TeamSimulationSettings } from "./simulation-settings";
import { Backlog } from "./backlog";
import seedrandom from 'seedrandom';

type TeamSimulation = {
    team: Team,
    renderer: Renderer
}


function getTeamFromSettings(settings: TeamSimulationSettings): Team {
    return Team.new(
        Backlog.newBacklog(
            new UnitOfWorkFactory(
                {
                    randomSeed: seedrandom(settings.randomSeed),
                    togetherFactor: settings.collaborationEfficiency,
                    unitSize: settings.unitSize,
                    teamSize: settings.teamSize
                }
            )
        ),
        new Strategy(
            {
                batchSize: settings.batchSize,
                wipLimit: settings.wipLimit
            }
        ),
        settings.teamSize
    )
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
        this.teamSimulations.forEach(simulation => simulation.renderer.clear());
    }

}

export { SimulationRunner, getTeamFromSettings }