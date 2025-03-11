import { Simulation } from "./simulation";

class Renderer {
    private backlog;
    private inProgress;
    private done;
    private statsDiv;

    constructor() {
        this.backlog = document.getElementById('backlog');
        this.inProgress = document.getElementById('inprogress');
        this.done = document.getElementById('done');
        this.statsDiv = document.getElementById('stats');
    }

    // private createBoxes(simulation: Simulation, existingIds) {
    //     simulation.backlog.batchesOfWork.forEach((uow) => {
    //         if (existingIds.includes(uow.id)) {
    //             return;
    //         }
    //         this.backlog.innerHTML += "<div id='" + uow.id + "' class='uow'></div>" ;

    //     })
    // }

    // private removeBoxes(simulation: Simulation, existingIds: string[]) {
    //     existingIds.forEach((uowId) => {
    //         if (simulation.workInProgress.filter((uow) => uow.id === uowId).length > 0) {
    //             return;
    //         }
    //         document.getElementById(uowId).remove();

    //     })
    // }

    // private moveBoxes(simulation: SimulationState) {
    //     simulation.workInProgress.forEach((uow) => {
    //         gsap.to("#" + uow.id, { x: 0 + uow.progress * 400, duration: 0.3, yoyo: false, repeat: 0 });
    //     })
    // }

    // private updateAssignees(simulation: SimulationState) {
    //     simulation.workInProgress.forEach((uow) => {
    //         document.getElementById(uow.id).innerHTML = uow.assignees.join(" ") 
    //     })
    // }

    // private updateColor(simulation: SimulationState) {
    //     simulation.workInProgress.forEach((uow) => {
    //         if (uow.perspective === 1) {
    //             document.getElementById(uow.id).style.backgroundColor = 'darkcyan'
    //         }
    //         if (uow.perspective === 2) {
    //             document.getElementById(uow.id).style.backgroundColor = 'darkolivegreen'
    //         }
    //     })
    // }

    // private updateStats(state: SimulationState) {

    //     this.statsDiv.innerHTML = "Throughput: " + Math.round(state.flow * 100) / 100
    //     this.statsDiv.innerHTML += "<br>Cycle time: " + Math.round(state.cycleTime * 100) / 100
    //     this.statsDiv.innerHTML += "<br>WIP: " + Math.round(state.wip * 100) / 100;
    // }

    render(simulation: Simulation) {
        let html = "";
        simulation.backlog().everything().forEach(
            (unit) => {
                html += unit.id().charAt(0)
                html += " ";
            }
        )
        this.backlog.innerHTML = html;

        let html2 = "";
        simulation.inProgress().everything().forEach(
            (batch) => {
                batch.unitsOfWork.forEach(
                    (unit) => {
                        html2 += unit.id().charAt(0);
                        html2 += " ";
                    }
                )
                
            }
        )
        this.inProgress.innerHTML = html2;

        html2 = "";
        simulation.workDone().everything().forEach(
            (batch) => {
                batch.unitsOfWork.forEach(
                    (unit) => {
                        html2 += unit.id().charAt(0)
                        html2 += " ";
                    }
                )
                
            }
        )
        this.done.innerHTML = html2;

        this.statsDiv.innerHTML = 
        "Average cycle time: " + simulation.workDone().averageCycleTime().toFixed(3)
        + "<br>Troughput: " + simulation.workDone().throughPut().toFixed(3)
        + "<br><br>" + simulation.workDone().averageProccessingDuration().toFixed(3)

        // const uowDivs = this.teamDiv.getElementsByTagName('div');

        // let existingIds: string[] = [];

        // for (let i = 0; i < uowDivs.length; i++) {
        //     const childDiv = uowDivs[i];
        //     existingIds.push(childDiv.id);
        // }

        // this.createBoxes(simulation, existingIds);
        // this.removeBoxes(simulation, existingIds);
        // this.updateAssignees(simulation);
        // this.updateColor(simulation);
        // this.moveBoxes(simulation);
        
        // this.updateStats(simulation);

         }
}

export { Renderer }