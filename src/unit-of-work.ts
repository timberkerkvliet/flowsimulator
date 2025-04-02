import { PositiveInteger } from "./positive-integer"


class UnitOfWork {
    public readonly id: string
    public readonly timeStart: PositiveInteger | undefined

    private readonly baseProbability: number
    private readonly randomSeed: () => number
    
    constructor(private readonly props: {
        id: string,
        baseProbability: number,
        randomSeed: () => number,
        timeStart: PositiveInteger | undefined,
        timeDone: PositiveInteger | undefined
    }) {
        this.id = props.id;
        this.baseProbability = props.baseProbability;
        this.randomSeed = props.randomSeed;
        this.timeStart = props.timeStart;
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

    public progress(time: PositiveInteger, assignees: PositiveInteger[]): UnitOfWork {
        if (assignees.length === 0 || this.isDone()) {
            return this;
        }

        let timeDone = undefined;

        if (this.randomSeed() <= this.baseProbability * assignees.length) {
            timeDone = time;
        }

        return new UnitOfWork({...this.props, timeDone})
    }

    public hasStarted(): boolean {
        return this.timeStart !== undefined;
    }

    public isDone(): boolean {
        return this.props.timeDone !== undefined;
    }

}

export { UnitOfWork }

