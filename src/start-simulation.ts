
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer";
import { SimulationRunner, TeamSimulation } from "./simulation-runner"
import { SimulationSettings, theMechanism, wipLimitsWillHit, wipLimitTradeOff, collaboration } from "./simulation-settings";
import { createTeamFromSettings } from "./team-factory";

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

const allInputs = [
    speedElement,
    teamSizeElement,
    teamSizeElement2,
    randomSeedElement,
    randomSeedElement2,
    collaborationEfficiencyElement,
    collaborationEfficiencyElement2,
    unitSizeElement,
    unitSizeElement2,
    batchSizeElement,
    batchSizeElement2,
    wipLimitElement,
    wipLimitElement2
]

class SimulationState {
    public static runner: SimulationRunner | undefined;
}

function parseSettings(): SimulationSettings {
    return {
        teamSimulationsSettings: [
            {
                teamSize: PositiveInteger.fromNumber(parseFloat(teamSizeElement.value)),
                randomSeed: randomSeedElement.value,
                collaborationEfficiency: parseFloat(collaborationEfficiencyElement.value) / 10,
                unitSize: PositiveInteger.fromNumber(parseFloat(unitSizeElement.value)),
                batchSize: PositiveInteger.fromNumber(parseFloat(batchSizeElement.value)),
                wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimitElement.value))
            },
            {
                teamSize: PositiveInteger.fromNumber(parseFloat(teamSizeElement2.value)),
                randomSeed: randomSeedElement2.value,
                collaborationEfficiency: parseFloat(collaborationEfficiencyElement2.value) / 10,
                unitSize: PositiveInteger.fromNumber(parseFloat(unitSizeElement2.value)),
                batchSize: PositiveInteger.fromNumber(parseFloat(batchSizeElement2.value)),
                wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimitElement2.value))
            }
        ],
        sleepTime: 5000/(parseFloat(speedElement.value) + 1)
    }
}

function formatSettings(settings: SimulationSettings) {
    speedElement.value = (5000/settings.sleepTime - 1).toString();

    teamSizeElement.value = settings.teamSimulationsSettings[0].teamSize.value.toString();
    teamSizeElement2.value = settings.teamSimulationsSettings[1].teamSize.value.toString();

    randomSeedElement.value = settings.teamSimulationsSettings[0].randomSeed.toString();
    randomSeedElement2.value = settings.teamSimulationsSettings[1].randomSeed.toString();

    collaborationEfficiencyElement.value = (settings.teamSimulationsSettings[0].collaborationEfficiency * 10).toString();
    collaborationEfficiencyElement2.value = (settings.teamSimulationsSettings[1].collaborationEfficiency * 10).toString();

    unitSizeElement.value = settings.teamSimulationsSettings[0].unitSize.value.toString();
    unitSizeElement2.value = settings.teamSimulationsSettings[1].unitSize.value.toString();

    batchSizeElement.value = settings.teamSimulationsSettings[0].batchSize.value.toString();
    batchSizeElement2.value = settings.teamSimulationsSettings[1].batchSize.value.toString();

    wipLimitElement.value = settings.teamSimulationsSettings[0].wipLimit.value.toString();
    wipLimitElement2.value = settings.teamSimulationsSettings[1].wipLimit.value.toString();
}

function disableInputs() {
    for (const element of allInputs) {
        element.disabled = true;
    }
}

function enableInputs() {
    for (const element of allInputs) {
        element.disabled = false;
    }
}

async function runSimulation(settings: SimulationSettings) {
    stopSimulation();
    formatSettings(settings);
    disableInputs();

    const team = createTeamFromSettings(settings.teamSimulationsSettings[0]);
    const team2 = createTeamFromSettings(settings.teamSimulationsSettings[1]);

    const runner = new SimulationRunner(
        [
            new TeamSimulation(
                team,
                new Renderer(
                    document.getElementById('backlog'),
                    document.getElementById('inprogress'),
                    document.getElementById('cycletime'),
                    document.getElementById('throughput'),
                    document.getElementById('utilization')
                )
            ),
            new TeamSimulation(
                team2,
                new Renderer(
                    document.getElementById('backlog-2'),
                    document.getElementById('inprogress-2'),
                    document.getElementById('cycletime-2'),
                    document.getElementById('throughput-2'),
                    document.getElementById('utilization-2')
                )
            )
        ],
        settings.sleepTime,
        false
    );

    SimulationState.runner = runner;

    button.textContent = "Stop simulation"
    
    await runner.run();
}

function stopSimulation() {
    if (SimulationState.runner === undefined) {
        return;
    }
    SimulationState.runner.stop();
    SimulationState.runner = undefined;
    enableInputs();
    button.textContent = "Start simulation"
}

async function clickButton() {
    if (SimulationState.runner !== undefined) {
        stopSimulation();
        return;
    }

    const settings = parseSettings();
    await runSimulation(settings);
}

button.addEventListener('click', clickButton);

document.getElementById('theMechanism').addEventListener('click', () => runSimulation(theMechanism));
document.getElementById('wipLimitsWillHit').addEventListener('click', () => runSimulation(wipLimitsWillHit));
document.getElementById('wipLimitTradeOff').addEventListener('click', () => runSimulation(wipLimitTradeOff));
document.getElementById('collaboration').addEventListener('click', () => runSimulation(collaboration));
