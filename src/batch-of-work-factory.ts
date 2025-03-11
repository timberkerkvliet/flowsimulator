import { PositiveInteger } from "./positive-integer";
import { UnitOfWork } from "./unit-of-work";

function geometricRealization(p: number): number {
    if (p <= 0 || p > 1) {
        throw new Error("Probability p must be in the range (0, 1].");
    }
    
    let count = 1;
    while (Math.random() >= p) {
        count++;
    }
    
    return count;
}

class BatchOfWorkFactory {
    constructor(
        private readonly props: {
            lambda: number,
            mu: number
        }
    ) {}
    
    public create(time: PositiveInteger): UnitOfWork {
        const arrivalDuration = PositiveInteger.fromNumber(geometricRealization(1/this.props.lambda));

        return UnitOfWork.new(
            time.add(arrivalDuration),
            PositiveInteger.fromNumber(geometricRealization(1/this.props.mu)),
            arrivalDuration
        );
    }
    

}

export { BatchOfWorkFactory }