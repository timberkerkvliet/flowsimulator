import { UnitOfWork } from "./uow";

function exponentialRandom(mu: number): number {
    return Math.round(-Math.log(1 - Math.random()) * mu);
}

class UnitOfWorkFactory {
    constructor(private mu: number) {}

    create(): UnitOfWork {
        let c = [];
        for (let i = 0; i < exponentialRandom(this.mu); i ++) {
            c.push(1)
        }
        return new UnitOfWork(c);
    }
}

export { UnitOfWorkFactory }