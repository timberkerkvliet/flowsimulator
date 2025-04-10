
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
const randomSeedElement = document.getElementById('randomSeed') as HTMLInputElement;

const collaborationEfficiencyElement = document.getElementById('collaborationEfficiency') as HTMLInputElement;
const speedElement = document.getElementById('speed') as HTMLInputElement;

const batchSizeElement = document.getElementById('batchSize') as HTMLInputElement;
const wipLimitElement = document.getElementById('wipLimit') as HTMLInputElement;


class SimulationState {
    public static runner: SimulationRunner | undefined;
}

function valuesFromUrl() {
    const queryString = window.location.search;
    const params: Record<string, string> = {};
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((value, key) => {
        params[key] = value;
      });

    if (params["teamSize"]) {
        teamSizeElement.value = params["teamSize"];
    }
    if (params["randomSeed"]) {
        randomSeedElement.value = params["randomSeed"];
    }
    if (params["collaborationEfficiency"]) {
        collaborationEfficiencyElement.value = params["collaborationEfficiency"];
    }
    if (params["speed"]) {
        speedElement.value = params["speed"];
    }
    if (params["batchSize"]) {
        batchSizeElement.value = params["batchSize"];
    }
    if (params["wipLimit"]) {
        wipLimitElement.value = params["wipLimit"];
    }
}

async function clickButton() {
    button.textContent = "Update";
    teamSizeElement.disabled = true;
    randomSeedElement.disabled = true;

    const batchOfWorkFactory = new UnitOfWorkFactory(
        {
            randomSeed: seedrandom(randomSeedElement.value),
            togetherFactor: parseFloat(collaborationEfficiencyElement.value)/10
        }
    );

    const strategy = new Strategy(
        {
            batchSize: PositiveInteger.fromNumber(parseFloat(batchSizeElement.value)),
            wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimitElement.value))
        }
    )

    const teamSize = PositiveInteger.fromNumber(parseFloat(teamSizeElement.value));

    const sleepTime = 5000/(parseFloat(speedElement.value) + 1)
    
    if (SimulationState.runner === undefined) {
        const team = Team.new(
            Backlog.newBacklog(batchOfWorkFactory, PositiveInteger.fromNumber(100), teamSize),
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
}

button.addEventListener('click', clickButton);

valuesFromUrl();