import { PositiveInteger } from "./positive-integer";
import { randomTeamMember, UnitOfWork } from "./unit-of-work";

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
            randomSeed: () => number,
            togetherFactor: number
        }
    ) {}
    
    public create(teamSize: PositiveInteger): UnitOfWork {
        return new UnitOfWork({
            id: randomLetters(this.props.randomSeed),
            baseProbability: 0.1,
            togetherFactor: this.props.togetherFactor,
            randomSeed: this.props.randomSeed,
            needsMember: randomTeamMember(teamSize, this.props.randomSeed),
            timeStart: undefined,
            timeDone: undefined,
            utilization: 0
        });
    }
    

}

export { UnitOfWorkFactory }