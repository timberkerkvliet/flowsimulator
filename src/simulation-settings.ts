import { PositiveInteger } from "./positive-integer"

type TeamSimulationSettings = {
    randomSeed: string,
    teamSize: PositiveInteger,
    collaborationEfficiency: number,
    unitSize: PositiveInteger,
    batchSize: PositiveInteger,
    wipLimit: PositiveInteger
}

type SimulationSettings = {
    teamSimulationsSettings: TeamSimulationSettings[],
    sleepTime: number
}

const theMechanism = {
    sleepTime: 300,
    teamSimulationsSettings: [
        {
            teamSize: PositiveInteger.fromNumber(4),
            randomSeed: 'fuchsia',
            unitSize: PositiveInteger.fromNumber(2),
            batchSize: PositiveInteger.fromNumber(2),
            wipLimit: PositiveInteger.fromNumber(4),
            collaborationEfficiency: 0
        },
        {
            teamSize: PositiveInteger.fromNumber(4),
            randomSeed: 'fuchsia',
            unitSize: PositiveInteger.fromNumber(2),
            batchSize: PositiveInteger.fromNumber(2),
            wipLimit: PositiveInteger.fromNumber(4),
            collaborationEfficiency: 1
        }
    ]
}

const wipLimitsWillHit = {
    sleepTime: 100,
    teamSimulationsSettings: [
        {
            teamSize: PositiveInteger.fromNumber(4),
            randomSeed: 'black',
            unitSize: PositiveInteger.fromNumber(2),
            batchSize: PositiveInteger.fromNumber(2),
            wipLimit: PositiveInteger.fromNumber(20),
            collaborationEfficiency: 0.8
        },
        {
            teamSize: PositiveInteger.fromNumber(4),
            randomSeed: 'white',
            unitSize: PositiveInteger.fromNumber(2),
            batchSize: PositiveInteger.fromNumber(2),
            wipLimit: PositiveInteger.fromNumber(20),
            collaborationEfficiency: 0.8
        }
    ]
}

export { SimulationSettings, TeamSimulationSettings, theMechanism, wipLimitsWillHit }
