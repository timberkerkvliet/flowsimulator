import { BatchOfWork } from "./batch-of-work"
import { PositiveInteger } from "./positive-integer"
import { Strategy } from "./strategy";
import { WorkAssignments } from "./work-assignment";
import { WorkDone } from "./work-done";
import { WorkOnBacklog } from "./work-on-backlog";

class Team {
    constructor(
        private readonly props: {
            backlog: WorkOnBacklog,
            workingOn: WorkAssignments,
            strategy: Strategy,
            done: WorkDone,
            currentTime: PositiveInteger
        }
    ) {}

    public static new(backlog: WorkOnBacklog, strategy: Strategy): Team {
        return new Team(
            {
                backlog: backlog,
                workingOn: new WorkAssignments({assignments: []}),
                done: new WorkDone({work: [], time: PositiveInteger.fromNumber(1)}),
                currentTime: PositiveInteger.fromNumber(1),
                strategy: strategy
            }
        );
    }

    public backlog(): WorkOnBacklog {
        return this.props.backlog;
    }

    public withStrategy(strategy: Strategy): Team {
        return new Team({...this.props, strategy})
    }

    public withBacklog(backlog: WorkOnBacklog): Team {
        return new Team({...this.props, backlog})
    }

    public workInProgress(): BatchOfWork[] {
        return this.props.workingOn.batches();
    }

    public workDone(): WorkDone {
        return this.props.done;
    }

    public tick(): Team {
        const time = this.props.currentTime.next();
        let done = this.props.done;
        let workingOn = this.props.workingOn;
        let backlog = this.props.backlog;

        done = done.add(workingOn.getDone());
        workingOn = workingOn.removeDone()
        workingOn = this.props.strategy.execute(workingOn, backlog)
        backlog = backlog.remove(workingOn.units())

        workingOn = workingOn.progress(time);

        return new Team(
            {
                backlog: backlog,
                workingOn: workingOn,
                done: done.tick(),
                currentTime: time,
                strategy: this.props.strategy
            }
        );
    }


}

export { Team }
