import { WorkDone } from "./work-done";
import { WorkOnBacklog } from "./work-on-backlog";
import { WorkInProgress } from "./work-in-progress";
import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { min } from "../node_modules/simple-statistics/index";
import { UnitOfWorkFactory } from "./unit-of-work-factory";

class Simulation {
    constructor(
        private readonly props: {
            backlog: WorkOnBacklog,
            inProgress: WorkInProgress,
            done: WorkDone,
            maxBatchSize: PositiveInteger
        }
    ) { }

    public withWorkFactory(factory: UnitOfWorkFactory): Simulation {
        return new Simulation(
            {
                ...this.props,
                backlog: this.props.backlog.withWorkFactory(factory)
            }
        )
    }

    public withMaxBatchSize(value: PositiveInteger): Simulation {
        return new Simulation(
            {
                ...this.props,
                maxBatchSize: value
            }
        )
    }

    public workDone(): WorkDone {
        return this.props.done;
    }

    public inProgress(): WorkInProgress {
        return this.props.inProgress;
    }

    public backlog(): WorkOnBacklog {
        return this.props.backlog;
    }
    
    tick(): Simulation {
        let backlog = this.props.backlog.tick();
        let workInProgress = this.props.inProgress.tick();
        let done = this.props.done.tick();

        if (backlog.size().getValue() >= this.props.maxBatchSize.getValue() && workInProgress.canDoNewWork()) {
            
            const batch = new BatchOfWork(backlog.topOfBacklog(this.props.maxBatchSize));
            backlog = backlog.removeTopOfBacklog(this.props.maxBatchSize)
            workInProgress = workInProgress.startWorkingOn(batch);
        }
        
        for (const batch of workInProgress.workDone()) {
            done = done.finish(batch);
        }
       
        workInProgress = workInProgress.removeWorkDone();

        return new Simulation(
            {
                ...this.props,
                backlog: backlog,
                inProgress: workInProgress,
                done: done
            }
        );
    }

}

export { Simulation }