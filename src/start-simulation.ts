
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
const randomSeed = document.getElementById('randomSeed') as HTMLInputElement;

const togetherFactor = document.getElementById('togetherFactor') as HTMLInputElement;
const speed = document.getElementById('speed') as HTMLInputElement;

const maxBatchSize = document.getElementById('maxBatchSize') as HTMLInputElement;
const wipLimit = document.getElementById('wipLimit') as HTMLInputElement;



class SimulationState {
    public static runner: SimulationRunner | undefined;
}

if (button) {
    button.addEventListener('click', async () => {
        button.textContent = "Update";
        teamSizeElement.disabled = true;
        randomSeed.disabled = true;

        const batchOfWorkFactory = new UnitOfWorkFactory(
            {
                randomSeed: seedrandom(randomSeed.value),
                togetherFactor: parseFloat(togetherFactor.value)/10
            }
        );

        const strategy = new Strategy(
            {
                batchSize: PositiveInteger.fromNumber(parseFloat(maxBatchSize.value)),
                wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimit.value))
            }
        )

        const teamSize = PositiveInteger.fromNumber(parseFloat(teamSizeElement.value));

        const sleepTime = 5000/parseFloat(speed.value)
        
        if (SimulationState.runner === undefined) {
            const team = Team.new(
                Backlog.newBacklog(batchOfWorkFactory, PositiveInteger.fromNumber(30), teamSize),
                strategy,
                teamSize
            )

            const runner = new SimulationRunner(
                team,
                new Renderer(),
                sleepTime
            );

            SimulationState.runner = runner;
            await runner.run();
        } else {
            SimulationState.runner.updateWorkFactory(batchOfWorkFactory);
            SimulationState.runner.updateStrategy(strategy);
            SimulationState.runner.updateTeamSize(teamSize);
            SimulationState.runner.updateSleepTime(sleepTime);
        }
    });
}