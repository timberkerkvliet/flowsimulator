import { PositiveInteger } from "./positive-integer"
import { Strategy } from "./strategy";
import { WorkAssignments } from "./work-assignment";
import { WorkDone } from "./work-done";
import { Backlog } from "./backlog";
import { sum } from "simple-statistics";

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
                done: new WorkDone({work: [], time: PositiveInteger.fromNumber(0)}),
                currentTime: PositiveInteger.fromNumber(0),
                strategy: strategy,
                teamSize: size
            }
        );
    }

    public get size(): PositiveInteger {
        return this.props.teamSize;
    }

    public backlog(): Backlog {
        return this.props.backlog;
    }

    public assignments(): WorkAssignments {
        return this.props.workingOn;
    }

    public workDone(): WorkDone {
        return this.props.done;
    }

    public utilization(): number {
        const total = sum(this.props.workingOn.inProgress.map(x => x.utilization)) + this.props.done.utilization()
        
        return total/this.props.currentTime.value;
    }

    public tick(): Team {
        const time = this.props.currentTime;
        let done = this.props.done;
        let workingOn = this.props.workingOn;
        let backlog = this.props.backlog;

        ({ assignments: workingOn, backlog }  = this.props.strategy.execute(
            workingOn,
            backlog,
            this.props.teamSize
        ));
        workingOn = workingOn.progress(time);
        done = done.add(workingOn.unitsDone);

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
