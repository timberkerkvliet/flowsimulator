import { Renderer } from "./renderer";
import { Simulation } from "./simulation"
import { KeepBusyStrategy, MobStrategy } from "./strategy";
import { Team, Member, Perspective } from "./team";
import { UnitOfWorkFactory } from "./uow-factory";

const button = document.getElementById('startButton');
if (button) {
button.addEventListener('click', async () => {
    const simulation = new Simulation(
        new Team(
            [
                new Member('A', [1]),
                new Member('B', [2])
            ]
        ),
        new KeepBusyStrategy(
            new UnitOfWorkFactory(10)
        ),
        new Renderer()
        );
    button.remove();
    await simulation.run();
});
}