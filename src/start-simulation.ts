
import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer";
import { SimulationRunner } from "./simulation-runner"
import { Team } from "./team";
import { WorkOnBacklog } from "./work-on-backlog";
import seedrandom from 'seedrandom';
import { Strategy } from "./strategy";

const button = document.getElementById('startButton');
const maxBatchSize = document.getElementById('maxBatchSize') as HTMLInputElement;
const randomSeed = document.getElementById('randomSeed') as HTMLInputElement;


class SimulationState {
    public static runner: SimulationRunner | undefined;
}

if (button) {
    button.addEventListener('click', async () => {
        button.textContent = "Update";

        const batchOfWorkFactory = new UnitOfWorkFactory(
            {
                mu: 0.25,
                randomSeed: seedrandom(randomSeed.value)
            }
        );
        
        if (SimulationState.runner === undefined) {
            const team = Team.new(
                WorkOnBacklog.newBacklog(batchOfWorkFactory, PositiveInteger.fromNumber(30)),
                new Strategy({batchSize: PositiveInteger.fromNumber(parseFloat(maxBatchSize.value))})
            )

            const runner = new SimulationRunner(
                team,
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