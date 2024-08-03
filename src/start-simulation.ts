import { Renderer } from "./renderer";
import { Simulation } from "./simulation"
import { MobStrategy } from "./strategy";
import { Team } from "./team";

const button = document.getElementById('startButton');
if (button) {
button.addEventListener('click', async () => {
    const simulation = new Simulation(new Team(), new MobStrategy(), new Renderer());
    button.remove();
    await simulation.run();
});
}