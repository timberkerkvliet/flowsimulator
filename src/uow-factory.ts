import { Perspective } from "./team";
import { UnitOfWork } from "./uow";

function getGeometric(p: number): number {
    let result = 1;
    while (Math.random() >= p) {
        result += 1
    }
    return result;
}

class UnitOfWorkFactory {
    constructor(private mu: number) {}

    create(startPerspective: Perspective): UnitOfWork {
        let stages = [];
        const size = getGeometric(1/this.mu);
        for (let i = 0; i < size; i ++) {
            if (Math.random() > 0.5) {
                stages.push(1)
            } else {
                stages.push(2)
            }
        }
        stages[0] = startPerspective;
        return new UnitOfWork(stages);
    }
}

export { UnitOfWorkFactory }