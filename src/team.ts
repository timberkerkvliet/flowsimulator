import { BatchOfWork } from "./batch-of-work"
import { PositiveInteger } from "./positive-integer"
import { Strategy } from "./strategy";
import { WorkAssignments } from "./work-assignment";
import { WorkDone } from "./work-done";
import { Backlog } from "./backlog";

class Team {
    constructor(
        private readonly props: {
            backlog: Backlog,
            workingOn: WorkAssignments,
            strategy: Strategy,
            done: WorkDone,
            currentTime: PositiveInteger,
            teamSize: PositiveInteger
        }
    ) {}

    public static new(backlog: Backlog, strategy: Strategy, size: PositiveInteger): Team {
        return new Team(
            {
                backlog: backlog,
                workingOn: new WorkAssignments({assignments: []}),
                done: new WorkDone({work: [], time: PositiveInteger.fromNumber(1)}),
                currentTime: PositiveInteger.fromNumber(1),
                strategy: strategy,
                teamSize: size
            }
        );
    }

    public backlog(): Backlog {
        return this.props.backlog;
    }

    public withStrategy(strategy: Strategy): Team {
        return new Team({...this.props, strategy})
    }

    public withBacklog(backlog: Backlog): Team {
        return new Team({...this.props, backlog})
    }

    public withSize(size: PositiveInteger): Team {
        return new Team({...this.props, teamSize: size});
    }

    public workInProgress(): WorkAssignments {
        return this.props.workingOn;
    }

    public workDone(): WorkDone {
        return this.props.done;
    }

    public tick(): Team {
        const time = this.props.currentTime;
        let done = this.props.done;
        let workingOn = this.props.workingOn;
        let backlog = this.props.backlog;

        workingOn = workingOn.progress(time, this.props.teamSize);
        done = done.add(workingOn.batchesDone);
        workingOn = workingOn.removeDone();
        ({ assignments: workingOn, backlog }  = this.props.strategy.execute(
            workingOn,
            backlog,
            this.props.teamSize
        ));
        workingOn = workingOn.start(time);

        return new Team(
            {
                ...this.props,
                backlog,
                workingOn,
                done: done.tick(),
                currentTime: time.next()
            }
        );
    }


}

export { Team }
