import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer"
import { Team } from "./team";
import { Strategy } from "./strategy";


class SimulationRunner {
    constructor(
        private team: Team,
        private readonly renderer: Renderer,
        private sleepTime: number
    ) {}

    updateWorkFactory(factory: UnitOfWorkFactory) {
        this.team = this.team.withBacklog(
            this.team.backlog().withWorkFactory(factory)
        );
    }

    updateStrategy(strategy: Strategy) {
        this.team = this.team.withStrategy(
            strategy
        )
    }

    updateTeamSize(teamSize: PositiveInteger) {
        this.team = this.team.withSize(teamSize);
    }

    updateSleepTime(sleepTime: number) {
        this.sleepTime = sleepTime;
    }

    async run() {
        while (true) {
            this.team = this.team.tick();
            this.renderer.render(this.team);
            await new Promise(resolve => setTimeout(resolve, this.sleepTime));
        }
    }

}

export { SimulationRunner }