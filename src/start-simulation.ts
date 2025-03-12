
import { BatchOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer";
import { Simulation } from "./simulation";
import { SimulationRunner } from "./simulation-runner"
import { WorkDone } from "./work-done";
import { WorkInProgress } from "./work-in-progress";
import { WorkOnBacklog } from "./work-on-backlog";
import seedrandom from 'seedrandom';

const button = document.getElementById('startButton');
const maxBatchSize = document.getElementById('maxBatchSize') as HTMLInputElement;
const utilization = document.getElementById('utilization') as HTMLInputElement;
const randomSeed = document.getElementById('randomSeed') as HTMLInputElement;


class SimulationState {
    public static runner: SimulationRunner | undefined;
}

if (button) {
    button.addEventListener('click', async () => {
        button.textContent = "Update";

        const batchOfWorkFactory = new BatchOfWorkFactory(
            {
                mu: 0.25,
                lambda: 0.25 * parseFloat(utilization.value),
                randomSeed: seedrandom(randomSeed.value)
            }
        );
        
        if (SimulationState.runner === undefined) {
            const simulation = new Simulation(
                {
                    maxBatchSize: PositiveInteger.fromNumber(parseFloat(maxBatchSize.value)),
                    backlog: WorkOnBacklog.newBacklog(batchOfWorkFactory),
                    inProgress: WorkInProgress.new(),
                    done: new WorkDone({work: [], time: PositiveInteger.fromNumber(1)})
                }
            )

            const runner = new SimulationRunner(
                simulation,
                new Renderer()
            )

            SimulationState.runner = runner;
            await runner.run();
        } else {
            SimulationState.runner.updateWorkFactory(batchOfWorkFactory);
            SimulationState.runner.updateMaxBatchSize(PositiveInteger.fromNumber(parseFloat(maxBatchSize.value)))
        }
    });
}