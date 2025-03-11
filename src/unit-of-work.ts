import { PositiveInteger } from "./positive-integer"

function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

class UnitOfWork {
    constructor(
        private readonly props: {
            id: string,
            arrivalDuration: PositiveInteger,
            processDuration: PositiveInteger,
            timeOfArrival: PositiveInteger;
            timeStartProcessing: PositiveInteger | undefined,
            timeDone: PositiveInteger | undefined,
        }
    ) {}

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

    public withArrivalTime(time: PositiveInteger) {
        return new UnitOfWork(
            {
               ...this.props,
               timeOfArrival: time
            }
        )
    }

    public static new(
        timeOfArrival: PositiveInteger,
        processingDuration: PositiveInteger,
        arrivalDuration: PositiveInteger
        ) {
        return new UnitOfWork({
            id: generateRandomString(10),
            processDuration: processingDuration,
            arrivalDuration: arrivalDuration,
            timeOfArrival: timeOfArrival,
            timeStartProcessing: undefined,
            timeDone: undefined
        });
    }

}

export { UnitOfWork }