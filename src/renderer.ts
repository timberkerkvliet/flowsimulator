import { ReadSimulation } from "./simulation";
import gsap from "gsap";


class Renderer {
    private teamDiv;
    private statsDiv;

    constructor() {
        this.teamDiv = document.getElementById('team');
        this.statsDiv = document.getElementById('stats');
    }

    private createBoxes(simulation: ReadSimulation, existingIds) {
        simulation.getWorkInProgress().forEach((uow) => {
            if (existingIds.includes(uow.getId())) {
                return;
            }
            this.teamDiv.innerHTML += "<div id='" + uow.getId() + "' class='uow'></div>" ;

        })
    }

    private removeBoxes(simulation: ReadSimulation, existingIds: string[]) {
        existingIds.forEach((uowId) => {
            if (simulation.getWorkInProgress().filter((uow) => uow.getId() === uowId).length > 0) {
                return;
            }
            document.getElementById(uowId).remove();

        })
    }

    private moveBoxes(simulation: ReadSimulation) {
        simulation.getWorkInProgress().forEach((uow) => {
            gsap.to("#" + uow.getId(), { x: 0 + uow.getProgress() * 400, duration: 0.3, yoyo: false, repeat: 0 });
        })
    }

    private updateAssignees(simulation: ReadSimulation) {
        simulation.getWorkInProgress().forEach((uow) => {
            const labels = uow.getAssignees().getMembers().map((member) => member.label)
            document.getElementById(uow.getId()).innerHTML = labels.join(" ")
            
        })
    }

    private updateStats(simulation: ReadSimulation) {
        const flow = simulation.getFinishedWork().length / simulation.getTime();
        const cycleTime = simulation.getFinishedWork().map((x) => x.getCycleTime()).reduce((x, y) => x + y, 0) / simulation.getFinishedWork().length;
        const wip = flow * cycleTime;

        this.statsDiv.innerHTML = "Flow: " + Math.round(flow * 100) / 100
        this.statsDiv.innerHTML += "<br>Cycle time: " + Math.round(cycleTime * 100) / 100
        this.statsDiv.innerHTML += "<br>WIP: " + Math.round(wip * 100) / 100;
    }

    render(simulation: ReadSimulation) {
        const uowDivs = this.teamDiv.getElementsByTagName('div');

        let existingIds: string[] = [];

        for (let i = 0; i < uowDivs.length; i++) {
            const childDiv = uowDivs[i];
            existingIds.push(childDiv.id);
        }

        this.createBoxes(simulation, existingIds);
        this.removeBoxes(simulation, existingIds);
        this.updateAssignees(simulation);
        this.moveBoxes(simulation);
        
        this.updateStats(simulation);

         }
}

export { Renderer }