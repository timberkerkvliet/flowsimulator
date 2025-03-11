import { Renderer } from "./renderer"
import { Simulation } from "./simulation";


class SimulationRunner {
    constructor(
        private readonly simulation: Simulation,
        private readonly renderer: Renderer
    ) {}

    async run() {
        let simulation = this.simulation;
        while (true) {
            console.log("New iteration")
            simulation = simulation.tick();
            this.renderer.render(simulation);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

}

export { SimulationRunner }