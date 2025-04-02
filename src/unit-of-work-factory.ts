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

function randomLetters(randomSeed: () => number): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 16; i++) {
        const index = Math.floor(randomSeed() * alphabet.length);
        result += alphabet[index];
    }
    return result;
}


class UnitOfWorkFactory {
    constructor(
        private readonly props: {
            mu: number,
            randomSeed: () => number
        }
    ) {}
    
    public create(): UnitOfWork {
        return new UnitOfWork({
            id: randomLetters(this.props.randomSeed),
            baseProbability: 0.25,
            randomSeed: this.props.randomSeed,
            timeStart: undefined,
            timeDone: undefined
        });
    }
    

}

export { UnitOfWorkFactory }