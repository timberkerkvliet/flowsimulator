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

function shuffle<T>(array: T[], randomSeed: () => number): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(randomSeed() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

class UnitOfWorkFactory {
    constructor(
        private readonly props: {
            randomSeed: () => number,
            togetherFactor: number,
            unitSize: PositiveInteger,
            teamSize: PositiveInteger
        }
    ) {
        if (props.unitSize.value > props.teamSize.value) {
            throw new Error("Unit size cannot be greater than team size when each task must have a different team member.");
        }
    }

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
        const teamMemberIds = Array.from({ length: this.props.teamSize.value }, (_, i) =>
            PositiveInteger.fromNumber(i + 1)
        );

        const shuffledMembers = shuffle(teamMemberIds, this.props.randomSeed).slice(0, this.props.unitSize.value);

        const tasks = shuffledMembers.map(member => this.createTask(member));

        return new UnitOfWork(tasks);
    }
}

export { UnitOfWorkFactory };
