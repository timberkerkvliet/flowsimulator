
import { UnitOfWorkFactory } from "./unit-of-work-factory";
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer";
import { SimulationRunner } from "./simulation-runner"
import { Team } from "./team";
import { Backlog } from "./backlog";
import seedrandom from 'seedrandom';
import { Strategy } from "./strategy";

const button = document.getElementById('startButton');
const speedElement = document.getElementById('speed') as HTMLInputElement;

const teamSizeElement = document.getElementById('teamSize') as HTMLInputElement;
const randomSeedElement = document.getElementById('randomSeed') as HTMLInputElement;
const collaborationEfficiencyElement = document.getElementById('collaborationEfficiency') as HTMLInputElement;
const unitSizeElement = document.getElementById('unitSize') as HTMLInputElement;
const batchSizeElement = document.getElementById('batchSize') as HTMLInputElement;
const wipLimitElement = document.getElementById('wipLimit') as HTMLInputElement;

const teamSizeElement2 = document.getElementById('teamSize-2') as HTMLInputElement;
const randomSeedElement2 = document.getElementById('randomSeed-2') as HTMLInputElement;
const collaborationEfficiencyElement2 = document.getElementById('collaborationEfficiency-2') as HTMLInputElement;
const unitSizeElement2 = document.getElementById('unitSize-2') as HTMLInputElement;
const batchSizeElement2 = document.getElementById('batchSize-2') as HTMLInputElement;
const wipLimitElement2 = document.getElementById('wipLimit-2') as HTMLInputElement;

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

function strategy(batchSizeElement: HTMLInputElement, wipLimitElement: HTMLInputElement): Strategy {
    return new Strategy(
        {
            batchSize: PositiveInteger.fromNumber(parseFloat(batchSizeElement.value)),
            wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimitElement.value))
        }
    )
}

function teamSize(teamSizeElement: HTMLInputElement): PositiveInteger {
    return PositiveInteger.fromNumber(parseFloat(teamSizeElement.value));
}

function unitOfWorkFactory(
    randomSeedElement: HTMLInputElement,
    teamSizeElement: HTMLInputElement,
    collaborationEfficiencyElement: HTMLInputElement,
    unitSizeElement: HTMLInputElement
): UnitOfWorkFactory {
    return new UnitOfWorkFactory(
        {
            randomSeed: seedrandom(randomSeedElement.value),
            togetherFactor: parseFloat(collaborationEfficiencyElement.value)/10,
            unitSize: PositiveInteger.fromNumber(parseFloat(unitSizeElement.value)),
            teamSize: teamSize(teamSizeElement)
        }
    );
}

async function clickButton() {
    button.textContent = "Restart simulation";

    const sleepTime = 5000/(parseFloat(speedElement.value) + 1)

    if (SimulationState.runner !== undefined) {
        SimulationState.runner.stop();
    }
    
    const team = Team.new(
        Backlog.newBacklog(
            unitOfWorkFactory(
                randomSeedElement,
                teamSizeElement,
                collaborationEfficiencyElement,
                unitSizeElement
            )
        ),
        strategy(batchSizeElement, wipLimitElement),
        teamSize(teamSizeElement)
    )

    const team2 = Team.new(
        Backlog.newBacklog(
            unitOfWorkFactory(
                randomSeedElement2,
                teamSizeElement2,
                collaborationEfficiencyElement2,
                unitSizeElement2
            )
        ),
        strategy(batchSizeElement2, wipLimitElement2),
        teamSize(teamSizeElement2)
    )

    const runner = new SimulationRunner(
        [
            {
                team: team,
                renderer: new Renderer(
                    document.getElementById('backlog'),
                    document.getElementById('inprogress'),
                    document.getElementById('cycletime'),
                    document.getElementById('throughput'),
                    document.getElementById('utilization')
                )
            },
            {
                team: team2,
                renderer: new Renderer(
                    document.getElementById('backlog-2'),
                    document.getElementById('inprogress-2'),
                    document.getElementById('cycletime-2'),
                    document.getElementById('throughput-2'),
                    document.getElementById('utilization-2')
                )
            }
        ],
        sleepTime,
        false
    );

    SimulationState.runner = runner;
    await runner.run();
}

button.addEventListener('click', clickButton);

valuesFromUrl();