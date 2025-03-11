
import { BatchOfWorkFactory } from "./batch-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer";
import { Simulation } from "./simulation";
import { SimulationRunner } from "./simulation-runner"
import { WorkDone } from "./work-done";
import { WorkInProgress } from "./work-in-progress";
import { WorkOnBacklog } from "./work-on-backlog";

const button = document.getElementById('startButton');
if (button) {
button.addEventListener('click', async () => {
    button.remove();

    const batchOfWorkFactory = new BatchOfWorkFactory(
        {
            mu: 4,
            lambda: 4
        }
    );

    const simulation = new Simulation(
        {
            maxBatchSize: PositiveInteger.fromNumber(4),
            backlog: WorkOnBacklog.newBacklog(batchOfWorkFactory),
            inProgress: WorkInProgress.new(),
            done: new WorkDone({work: [], time: PositiveInteger.fromNumber(1)})
        }
    )

    const runner = new SimulationRunner(
        simulation,
        new Renderer()
    )
    await runner.run();
});
}