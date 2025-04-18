import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer"
import { Team } from "./team";
import { Strategy } from "./strategy";


class SimulationRunner {
    constructor(
        private team: Team,
        private readonly renderer: Renderer,
        private team2: Team,
        private readonly renderer2: Renderer,
        private sleepTime: number,
        private stopped: boolean
    ) {}

    stop() {
        this.stopped = true;
    }

    async run() {
        while (!this.stopped) {
            this.team = this.team.tick();
            this.team2 = this.team2.tick();
            this.renderer.render(this.team);
            this.renderer2.render(this.team2);
            await new Promise(resolve => setTimeout(resolve, this.sleepTime));
        }
    }

}

export { SimulationRunner }