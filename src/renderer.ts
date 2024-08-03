import { SimulationState } from "./simulation";
import gsap from "gsap";

class Renderer {
    private teamDiv;
    private statsDiv;

    constructor() {
        this.teamDiv = document.getElementById('team');
        this.statsDiv = document.getElementById('stats');
    }

    private createBoxes(state: SimulationState, existingIds) {
        state.workInProgress.forEach((uow) => {
            if (existingIds.includes(uow.getId())) {
                return;
            }
            this.teamDiv.innerHTML += "<div id='" + uow.getId() + "' class='uow'></div>" ;

        })
    }

    private removeBoxes(state: SimulationState, existingIds: string[]) {
        existingIds.forEach((uowId) => {
            if (state.workInProgress.filter((uow) => uow.getId() === uowId).length > 0) {
                return;
            }
            document.getElementById(uowId).remove();

        })
    }

    render(state: SimulationState) {
        const uowDivs = this.teamDiv.getElementsByTagName('div');

        let existingIds: string[] = [];

        for (let i = 0; i < uowDivs.length; i++) {
            const childDiv = uowDivs[i];
            existingIds.push(childDiv.id);
        }

        this.createBoxes(state, existingIds);
        this.removeBoxes(state, existingIds);

        state.workInProgress.forEach((uow) => {
            gsap.to("#" + uow.getId(), { x: 0 + uow.getProgress() * 400, duration: 0.3, yoyo: false, repeat: 0 });
        })

        this.statsDiv.innerHTML = "Finished: " + state.finishedWork.length;

    }
}

export { Renderer }