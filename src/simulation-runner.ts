import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer"
import { Team } from "./team";
import { Strategy } from "./strategy";


class SimulationRunner {
    constructor(
        private team: Team,
        private readonly renderer: Renderer,
        private sleepTime: number,
        private stopped: boolean
    ) {}

    stop() {
        this.stopped = true;
    }

    async run() {
        while (!this.stopped) {
            this.team = this.team.tick();
            this.renderer.render(this.team);
            await new Promise(resolve => setTimeout(resolve, this.sleepTime));
        }
    }

}

export { SimulationRunner }