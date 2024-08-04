
import gsap from "gsap";
import { Perspective } from "./team";

type UnitState = {
    id: string;
    progress: number;
    assignees: string[];
    perspective: Perspective;
}

type SimulationState = {
    time: number;
    flow: number;
    cycleTime: number;
    wip: number;
    workInProgress: UnitState[]
}


class Renderer {
    private teamDiv;
    private statsDiv;

    constructor() {
        this.teamDiv = document.getElementById('team');
        this.statsDiv = document.getElementById('stats');
    }

    private createBoxes(simulation: SimulationState, existingIds) {
        simulation.workInProgress.forEach((uow) => {
            if (existingIds.includes(uow.id)) {
                return;
            }
            this.teamDiv.innerHTML += "<div id='" + uow.id + "' class='uow'></div>" ;

        })
    }

    private removeBoxes(simulation: SimulationState, existingIds: string[]) {
        existingIds.forEach((uowId) => {
            if (simulation.workInProgress.filter((uow) => uow.id === uowId).length > 0) {
                return;
            }
            document.getElementById(uowId).remove();

        })
    }

    private moveBoxes(simulation: SimulationState) {
        simulation.workInProgress.forEach((uow) => {
            gsap.to("#" + uow.id, { x: 0 + uow.progress * 400, duration: 0.3, yoyo: false, repeat: 0 });
        })
    }

    private updateAssignees(simulation: SimulationState) {
        simulation.workInProgress.forEach((uow) => {
            document.getElementById(uow.id).innerHTML = uow.assignees.join(" ") 
        })
    }

    private updateColor(simulation: SimulationState) {
        simulation.workInProgress.forEach((uow) => {
            if (uow.perspective === 1) {
                document.getElementById(uow.id).style.backgroundColor = 'darkcyan'
            }
            if (uow.perspective === 2) {
                document.getElementById(uow.id).style.backgroundColor = 'darkolivegreen'
            }
        })
    }

    private updateStats(state: SimulationState) {

        this.statsDiv.innerHTML = "Throughput: " + Math.round(state.flow * 100) / 100
        this.statsDiv.innerHTML += "<br>Cycle time: " + Math.round(state.cycleTime * 100) / 100
        this.statsDiv.innerHTML += "<br>WIP: " + Math.round(state.wip * 100) / 100;
    }

    render(simulation: SimulationState) {
        const uowDivs = this.teamDiv.getElementsByTagName('div');

        let existingIds: string[] = [];

        for (let i = 0; i < uowDivs.length; i++) {
            const childDiv = uowDivs[i];
            existingIds.push(childDiv.id);
        }

        this.createBoxes(simulation, existingIds);
        this.removeBoxes(simulation, existingIds);
        this.updateAssignees(simulation);
        this.updateColor(simulation);
        this.moveBoxes(simulation);
        
        this.updateStats(simulation);

         }
}

export { Renderer, SimulationState }