import { BatchOfWork } from "./batch-of-work"
import { PositiveInteger } from "./positive-integer"

class WorkInProgress {
    constructor(
        private readonly props: {
            workingOn: BatchOfWork | undefined,
            done: BatchOfWork[],
            currentTime: PositiveInteger
        }
    ) {}

    public everything(): BatchOfWork[] {
        if (this.props.workingOn === undefined) {
            return [];
        }
        return [this.props.workingOn];
    }

    public workDone(): BatchOfWork[] {
        return this.props.done;
    }

    public removeWorkDone(): WorkInProgress {
        return new WorkInProgress(
            {
                ...this.props,
                done: []
            }
        )
    }

    public canDoNewWork(): boolean {
        return this.props.workingOn === undefined;
    }

    public static new(): WorkInProgress {
        return new WorkInProgress(
            {
                workingOn: undefined,
                done: [],
                currentTime: PositiveInteger.fromNumber(1)
            }
        );
    }

    public startWorkingOn(batch: BatchOfWork): WorkInProgress {
        if (this.props.workingOn !== undefined) {
            throw new Error();
        }
        return new WorkInProgress(
            {
                ...this.props,
                workingOn: batch.startWork(this.props.currentTime)
            }
        )
    }
    
    public tick(): WorkInProgress {
        const time = this.props.currentTime.next();
        let done = this.props.done;
        let workingOn = this.props.workingOn;

        if (workingOn !== undefined && workingOn.timeDone().getValue() === time.getValue()) {
            done = [...done, workingOn.endWork(time)];
            workingOn = undefined;
        }
        return new WorkInProgress(
            {
                workingOn: workingOn,
                done: done,
                currentTime: time
            }
        );
    }


}

export { WorkInProgress }
