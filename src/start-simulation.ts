
import { PositiveInteger } from "./positive-integer";
import { Renderer } from "./renderer";
import { getTeamFromSettings, SimulationRunner } from "./simulation-runner"
import { SimulationSettings } from "./simulation-settings";

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

function parseSettings(): SimulationSettings {
    return {
        teamSimulationsSettings: [
            {
                teamSize: PositiveInteger.fromNumber(parseFloat(teamSizeElement.value)),
                randomSeed: randomSeedElement.value,
                collaborationEfficiency: parseFloat(collaborationEfficiencyElement.value),
                unitSize: PositiveInteger.fromNumber(parseFloat(unitSizeElement.value)),
                batchSize: PositiveInteger.fromNumber(parseFloat(batchSizeElement.value)),
                wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimitElement.value))
            },
            {
                teamSize: PositiveInteger.fromNumber(parseFloat(teamSizeElement2.value)),
                randomSeed: randomSeedElement2.value,
                collaborationEfficiency: parseFloat(collaborationEfficiencyElement2.value),
                unitSize: PositiveInteger.fromNumber(parseFloat(unitSizeElement2.value)),
                batchSize: PositiveInteger.fromNumber(parseFloat(batchSizeElement2.value)),
                wipLimit: PositiveInteger.fromNumber(parseFloat(wipLimitElement2.value))
            }
        ],
        sleepTime: 5000/(parseFloat(speedElement.value) + 1)
    }
}

async function clickButton() {
    button.textContent = "Restart simulation";

    const settings = parseSettings();

    if (SimulationState.runner !== undefined) {
        SimulationState.runner.stop();
    }
    
    const team = getTeamFromSettings(settings.teamSimulationsSettings[0]);
    const team2 = getTeamFromSettings(settings.teamSimulationsSettings[1]);

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
        settings.sleepTime,
        false
    );

    SimulationState.runner = runner;
    await runner.run();
}

button.addEventListener('click', clickButton);
