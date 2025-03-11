import { WorkDone } from "./work-done";
import { WorkOnBacklog } from "./work-on-backlog";
import { WorkInProgress } from "./work-in-progress";
import { BatchOfWork } from "./batch-of-work";
import { PositiveInteger } from "./positive-integer";
import { max, min } from "../node_modules/simple-statistics/index";

class Simulation {
    constructor(
        private readonly props: {
            backlog: WorkOnBacklog,
            inProgress: WorkInProgress,
            done: WorkDone,
            maxBatchSize: PositiveInteger
        }
    ) { }

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

        if (backlog.size().getValue() > 0 && workInProgress.canDoNewWork()) {
            const batchSize = PositiveInteger.fromNumber(
                min([backlog.size().getValue(), this.props.maxBatchSize.getValue()])
            );
            const batch = new BatchOfWork(backlog.topOfBacklog(batchSize));
            backlog = backlog.removeTopOfBacklog(batchSize)
            workInProgress = workInProgress.startWorkingOn(batch);
        }

        done = done.finish(workInProgress.workDone());
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