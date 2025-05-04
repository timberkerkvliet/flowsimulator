import { Backlog } from "./backlog";
import { TeamSimulationSettings } from "./simulation-settings";
import { BaseStrategy, Strategy } from "./strategy";
import { Team } from "./team";
import { UnitOfWorkFactory } from "./unit-of-work-factory";
import seedrandom from 'seedrandom';
import { CollaborationStrategy } from "./collaboration-strategy";

function strategyFromSettings(settings: TeamSimulationSettings): Strategy {
    const strategy = new BaseStrategy(
        {
            batchSize: settings.batchSize,
            wipLimit: settings.wipLimit
        }
    )
    if (settings.collaborationEfficiency > 0) {
        return new CollaborationStrategy(strategy)
    }
    return strategy;
}

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
    const strategy = strategyFromSettings(settings);

    return Team.new(
        backlog,
        strategy,
        settings.teamSize
    );
}

export { createTeamFromSettings }