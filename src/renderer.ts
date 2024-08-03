import { Simulation } from "./simulation";
import gsap from "gsap";


class Renderer {
    private teamDiv;
    private statsDiv;

    constructor() {
        this.teamDiv = document.getElementById('team');
        this.statsDiv = document.getElementById('stats');
    }

    private createBoxes(simulation: Simulation, existingIds) {
        simulation.getWorkInProgress().forEach((uow) => {
            if (existingIds.includes(uow.getId())) {
                return;
            }
            this.teamDiv.innerHTML += "<div id='" + uow.getId() + "' class='uow'></div>" ;

        })
    }

    private removeBoxes(simulation: Simulation, existingIds: string[]) {
        existingIds.forEach((uowId) => {
            if (simulation.getWorkInProgress().filter((uow) => uow.getId() === uowId).length > 0) {
                return;
            }
            document.getElementById(uowId).remove();

        })
    }

    render(simulation: Simulation) {
        const uowDivs = this.teamDiv.getElementsByTagName('div');

        let existingIds: string[] = [];

        for (let i = 0; i < uowDivs.length; i++) {
            const childDiv = uowDivs[i];
            existingIds.push(childDiv.id);
        }

        this.createBoxes(simulation, existingIds);
        this.removeBoxes(simulation, existingIds);

        simulation.getWorkInProgress().forEach((uow) => {
            gsap.to("#" + uow.getId(), { x: 0 + uow.getProgress() * 400, duration: 0.3, yoyo: false, repeat: 0 });
        })

        this.statsDiv.innerHTML = "Finished: " + simulation.getFinishedWork().length;

    }
}

export { Renderer }