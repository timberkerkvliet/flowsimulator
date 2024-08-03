import { Renderer } from "./renderer";
import { Simulation } from "./simulation"
import { Team } from "./team";

const button = document.getElementById('startButton');
if (button) {
button.addEventListener('click', async () => {
    console.log("Click!")
    const simulation = new Simulation(new Team(), new Renderer());
    await simulation.run();
});
}