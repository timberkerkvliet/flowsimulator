import { PositiveInteger } from "./positive-integer"

class UnitOfWork {
    constructor(
        private readonly props: {
            id: string,
            baseProbability: number,
            randomSeed: () => number,
            timeStart: PositiveInteger | undefined,
            timeDone: PositiveInteger | undefined
        }
    ) {}

    public id(): string {
        return this.props.id;
    }

    public timeStart(): PositiveInteger {
        return this.props.timeStart;
    }

    public start(time: PositiveInteger): UnitOfWork {
        return new UnitOfWork({...this.props, timeStart: time})
    }

    public progress(time: PositiveInteger, assignees: PositiveInteger[]): UnitOfWork {
        if (assignees.length === 0 || this.isDone()) {
            return this;
        }

        let timeDone = undefined;

        if (this.props.randomSeed() <= this.props.baseProbability * assignees.length) {
            timeDone = time;
        }

        return new UnitOfWork(
            {
                ...this.props,
                timeDone
            }
        )
    }

    public isDone(): boolean {
        return this.props.timeDone !== undefined;
    }

    public timeInProgress(): PositiveInteger {
        return this.props.timeDone.minus(this.props.timeStart);
    }

    public timeDone(): PositiveInteger {
        const timeDone = this.props.timeDone;
        if (timeDone === undefined) {
            throw new Error();
        }
        return timeDone;
    }

}

export { UnitOfWork }

function ONE(ONE: any): PositiveInteger {
    throw new Error("Function not implemented.");
}
