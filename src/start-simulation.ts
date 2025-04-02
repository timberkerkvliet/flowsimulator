
import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer";
import { SimulationRunner } from "./simulation-runner"
import { Team } from "./team";
import { Backlog } from "./backlog";
import seedrandom from 'seedrandom';
import { Strategy } from "./strategy";

const button = document.getElementById('startButton');

const teamSizeElement = document.getElementById('teamSize') as HTMLInputElement;

const maxBatchSize = document.getElementById('maxBatchSize') as HTMLInputElement;
const wipLimit = document.getElementById('wipLimit') as HTMLInputElement;

const randomSeed = document.getElementById('randomSeed') as HTMLInputElement;


class SimulationState {
    public static runner: SimulationRunner | undefined;
}

if (button) {
    button.addEventListener('click', async () => {
        button.textContent = "Update";

        const batchOfWorkFactory = new UnitOfWorkFactory(
            {
                randomSeed: seedrandom(randomSeed.value)
            }
        );

        const strategy = new Strategy(
            {
                batchSize: PositiveInteger.fromNumber(parseFloat(maxBatchSize.value)),
                wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimit.value))
            }
        )

        const teamSize = PositiveInteger.fromNumber(parseFloat(teamSizeElement.value));
        
        if (SimulationState.runner === undefined) {
            const team = Team.new(
                Backlog.newBacklog(batchOfWorkFactory, PositiveInteger.fromNumber(30)),
                strategy,
                teamSize
            )

            const runner = new SimulationRunner(
                team,
                new Renderer()
            )

            SimulationState.runner = runner;
            await runner.run();
        } else {
            SimulationState.runner.updateWorkFactory(batchOfWorkFactory);
            SimulationState.runner.updateStrategy(strategy);
            SimulationState.runner.updateTeamSize(teamSize);
        }
    });
}