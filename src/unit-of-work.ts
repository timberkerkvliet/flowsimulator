import { PositiveInteger } from "./positive-integer"

class UnitOfWork {
    constructor(
        private readonly props: {
            id: string,
            toGo: PositiveInteger,
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

    public progress(time: PositiveInteger, assignees: PositiveInteger[]): UnitOfWork {
        if (assignees.length === 0 || this.isDone()) {
            return this;
        }
        if (this.props.timeStart === undefined) {
            return new UnitOfWork({...this.props, timeStart: time})
        }

        let toGo = this.props.toGo;
        toGo = toGo.minus(PositiveInteger.fromNumber(1));
        let timeDone = toGo.isZero() ? time : undefined;

        return new UnitOfWork(
            {
                ...this.props,
                toGo,
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
