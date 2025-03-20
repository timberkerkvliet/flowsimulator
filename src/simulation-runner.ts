import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer"
import { Simulation } from "./simulation";


class SimulationRunner {
    constructor(
        private simulation: Simulation,
        private readonly renderer: Renderer
    ) {}

    updateWorkFactory(factory: UnitOfWorkFactory) {
        this.simulation = this.simulation.withWorkFactory(factory);
    }

    updateMaxBatchSize(value: PositiveInteger) {
        this.simulation = this.simulation.withMaxBatchSize(value);
    }

    async run() {
        while (true) {
            console.log("New iteration")
            this.simulation = this.simulation.tick();
            this.renderer.render(this.simulation);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

}

export { SimulationRunner }