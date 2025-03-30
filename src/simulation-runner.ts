import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer"
import { Team } from "./team";
import { Strategy } from "./strategy";


class SimulationRunner {
    constructor(
        private team: Team,
        private readonly renderer: Renderer
    ) {}

    updateWorkFactory(factory: UnitOfWorkFactory) {
        this.team = this.team.withBacklog(
            this.team.backlog().withWorkFactory(factory)
        );
    }

    updateMaxBatchSize(value: PositiveInteger) {
        this.team = this.team.withStrategy(
            new Strategy(
                {
                    batchSize: value
                }
            )
        )
    }

    async run() {
        while (true) {
            this.team = this.team.tick();
            this.renderer.render(this.team);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

}

export { SimulationRunner }