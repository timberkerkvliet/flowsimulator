import { PositiveInteger } from "./positive-integer"

function randomTeamMember(teamSize: PositiveInteger, randomSeed: () => number): PositiveInteger {
    return PositiveInteger.fromNumber(Math.floor(randomSeed() * teamSize.value) + 1);
}

class UnitOfWork {
    public readonly id: string
    public readonly timeStart: PositiveInteger | undefined
    public readonly needsMember: PositiveInteger

    private readonly baseProbability: number
    private readonly randomSeed: () => number
    
    constructor(private readonly props: {
        id: string,
        baseProbability: number,
        togetherFactor: number,
        randomSeed: () => number,
        needsMember: PositiveInteger,
        timeStart: PositiveInteger | undefined,
        timeDone: PositiveInteger | undefined
    }) {
        this.id = props.id;
        this.baseProbability = props.baseProbability;
        this.randomSeed = props.randomSeed;
        this.timeStart = props.timeStart;
        this.needsMember = props.needsMember;
    }

    public get timeDone(): PositiveInteger {
        if (this.props.timeDone === undefined) {
            throw new Error();
        }
        return this.props.timeDone;
    }

    public get timeInProgress(): PositiveInteger {
        return this.timeDone.minus(this.timeStart);
    }

    public start(time: PositiveInteger): UnitOfWork {
        if (this.hasStarted()) {
            return this;
        }

        return new UnitOfWork({...this.props, timeStart: time})
    }

    public canBeProgressedBy(assignees: PositiveInteger[]): boolean {
        if (assignees.length === 0 || this.isDone()) {
            return false;
        }

        return assignees.filter(assignee => assignee.equals(this.needsMember)).length > 0;
    }

    public get canCollaborate() : boolean {
        return this.props.togetherFactor > 0;
    }

    public progress(
        time: PositiveInteger,
        assignees: PositiveInteger[],
        teamSize: PositiveInteger
    ): UnitOfWork {
        if (!this.canBeProgressedBy(assignees)) {
            return this;
        }
        
        const needsMember = randomTeamMember(teamSize, this.randomSeed);

        let timeDone = undefined;

        let s = 0;

        for (let k = 0; k < assignees.length; k++) {
            s += this.baseProbability * this.props.togetherFactor**k
        }

        if (this.randomSeed() <= s) {
            timeDone = time;
        }

        return new UnitOfWork({...this.props, needsMember, timeDone})
    }

    public hasStarted(): boolean {
        return this.timeStart !== undefined;
    }

    public isDone(): boolean {
        return this.props.timeDone !== undefined;
    }

}

export { UnitOfWork, randomTeamMember }

