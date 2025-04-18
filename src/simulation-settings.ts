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

export { SimulationSettings, TeamSimulationSettings }
