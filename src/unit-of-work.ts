import { PositiveInteger } from "./positive-integer"

class UnitOfWork {
    constructor(
        private readonly props: {
            id: string,
            arrivalDuration: PositiveInteger,
            processDuration: PositiveInteger,
            timeOfArrival: PositiveInteger;
            timeStartProcessing: PositiveInteger | undefined,
            timeDone: PositiveInteger | undefined,
            value: number
        }
    ) {}

    public startProcessing(atTime: PositiveInteger): UnitOfWork {
        return new UnitOfWork(
            {
                ...this.props,
                timeStartProcessing: atTime
            }
        )
    }

    public endProcessing(atTime: PositiveInteger): UnitOfWork {
        return new UnitOfWork(
            {
                ...this.props,
                timeDone: atTime
            }
        )
    }

    public id(): string {
        return this.props.id;
    }

    public timeOfArrival(): PositiveInteger {
        return this.props.timeOfArrival;
    }

    public timeStartProcessing(): PositiveInteger {
        return this.props.timeStartProcessing;
    }

    public processDuration(): PositiveInteger {
        return this.props.processDuration;
    }

    public timeInSystem(): PositiveInteger {
        return this.props.timeDone.minus(this.props.timeOfArrival);
    }

    public timeInProgress(): PositiveInteger {
        return this.props.timeDone.minus(this.props.timeStartProcessing);
    }

    public timeDone(): PositiveInteger {
        const timeDone = this.props.timeDone;
        if (timeDone === undefined) {
            throw new Error();
        }
        return timeDone;
    }

    public arrivalDuration(): PositiveInteger {
        return this.props.arrivalDuration;
    }

}

export { UnitOfWork }