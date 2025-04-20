import { Backlog } from "./backlog";
import { TeamSimulationSettings } from "./simulation-settings";
import { Strategy } from "./strategy";
import { Team } from "./team";
import { UnitOfWorkFactory } from "./unit-of-work-factory";
import seedrandom from 'seedrandom';

function createTeamFromSettings(settings: TeamSimulationSettings): Team {
    const backlog = Backlog.newBacklog(
        new UnitOfWorkFactory(
            {
                randomSeed: seedrandom(settings.randomSeed),
                togetherFactor: settings.collaborationEfficiency,
                unitSize: settings.unitSize,
                teamSize: settings.teamSize
            }
        )
    );
    const strategy = new Strategy(
        {
            batchSize: settings.batchSize,
            wipLimit: settings.wipLimit
        }
    )

    return Team.new(
        backlog,
        strategy,
        settings.teamSize
    );
}

export { createTeamFromSettings }