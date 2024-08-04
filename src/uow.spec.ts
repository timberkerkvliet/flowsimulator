import { UnitOfWork } from "./uow"

describe("UnitOfWork", () => {
    it("should not progress without assignees", () => {
        const uow = new UnitOfWork([]);
        uow.tick()
        expect(uow.getProgress()).toBeCloseTo(0);
    })
})