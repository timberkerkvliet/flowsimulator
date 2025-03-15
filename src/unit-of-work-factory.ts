import { PositiveInteger } from "./positive-integer";
import { UnitOfWork } from "./unit-of-work";

function geometricRealization(p: number, randomSeed: () => number): number {
    if (p <= 0 || p > 1) {
        throw new Error("Probability p must be in the range (0, 1].");
    }
    
    let count = 1;
    while (randomSeed() >= p) {
        count++;
    }
    
    return count;
}

function randomLetter(randomSeed: () => number): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const index = Math.floor(randomSeed() * alphabet.length);
    return alphabet[index];
}

class UnitOfWorkFactory {
    constructor(
        private readonly props: {
            lambda: number,
            mu: number,
            randomSeed: () => number
        }
    ) {}
    
    public create(time: PositiveInteger): UnitOfWork {
        const arrivalDuration = PositiveInteger.fromNumber(geometricRealization(this.props.lambda, this.props.randomSeed));
        
        return new UnitOfWork({
            id: randomLetter(this.props.randomSeed),
            processDuration: PositiveInteger.fromNumber(geometricRealization(this.props.mu, this.props.randomSeed)),
            arrivalDuration: arrivalDuration,
            timeOfArrival: time.add(arrivalDuration),
            timeStartProcessing: undefined,
            timeDone: undefined
        });
    }
    

}

export { UnitOfWorkFactory as BatchOfWorkFactory }