import { UnitOfWork } from "./unit-of-work";
import { PositiveInteger } from "./positive-integer";
import { Task } from "./task";

function randomLetters(randomSeed: () => number): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 16; i++) {
        const index = Math.floor(randomSeed() * alphabet.length);
        result += alphabet[index];
    }
    return result;
}


function randomTeamMember(teamSize: PositiveInteger, randomSeed: () => number): PositiveInteger {
    return PositiveInteger.fromNumber(Math.floor(randomSeed() * teamSize.value) + 1);
}



class UnitOfWorkFactory {
    constructor(
        private readonly props: {
            randomSeed: () => number,
            togetherFactor: number,
            unitSize: PositiveInteger,
            teamSize: PositiveInteger
        }
    ) {}

    private createTask(member: PositiveInteger): Task {
        return new Task({
            id: randomLetters(this.props.randomSeed),
            baseProbability: 0.1,
            togetherFactor: this.props.togetherFactor,
            randomSeed: this.props.randomSeed,
            needsMember: member,
            timeStart: undefined,
            timeDone: undefined,
            utilization: 0
        });
    }
    
    public create(): UnitOfWork {
        let tasks: Task[] = [];
        for (let k = 0; k < this.props.unitSize.value; k++) {
            tasks = [...tasks, this.createTask(randomTeamMember(this.props.teamSize, this.props.randomSeed))]
        }
        return new UnitOfWork(tasks);
    }
    

}

export { UnitOfWorkFactory }