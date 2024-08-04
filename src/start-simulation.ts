import { Renderer } from "./renderer";
import { Simulation } from "./simulation"
import { MobStrategy } from "./strategy";
import { Team, Member, Perspective } from "./team";
import { UnitOfWorkFactory } from "./uow-factory";

const button = document.getElementById('startButton');
if (button) {
button.addEventListener('click', async () => {
    const simulation = new Simulation(
        new Team([new Member('T', [1]), new Member('M', [1])]),
        new MobStrategy(
            new UnitOfWorkFactory(30)
        ),
        new Renderer()
        );
    button.remove();
    await simulation.run();
});
}