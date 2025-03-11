import { PositiveInteger } from "./positive-integer";

interface ProbabilityDistribution<T> {
    getRealization(): T;
}

class RandomSeed<T> {
    private realizations: Record<number, T>;

    constructor(
        private readonly distribution: ProbabilityDistribution<T>
        ) {}

    getRealization(index: PositiveInteger): T {
        if (!this.realizations[index.toString()]) {
            this.realizations[index.toString()] = this.distribution.getRealization();
        }
        return this.realizations[index.toString()]
    }
}


export { ProbabilityDistribution, RandomSeed }